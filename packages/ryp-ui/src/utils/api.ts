/**
 * RYP API Client Wrapper
 *
 * Thin fetch wrapper with:
 * - JSON serialization / deserialization
 * - Typed error handling
 * - Request deduplication (in-flight cache)
 * - Simple exponential back-off retry
 * - Auth token injection via configurable getter
 */

// ── Types ──────────────────────────────────────────────────────────────────

export interface ApiClientConfig {
  /** Base URL for all requests — e.g. process.env.NEXT_PUBLIC_API_URL */
  baseUrl: string;
  /** Returns the Bearer token to attach, or null if unauthenticated */
  getToken?: () => Promise<string | null>;
  /** Default headers merged into every request */
  defaultHeaders?: Record<string, string>;
  /** Max retries for retryable failures (default 2) */
  maxRetries?: number;
  /** Request timeout in ms (default 10_000) */
  timeout?: number;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly body: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export interface ApiRequestOptions extends Omit<RequestInit, 'body'> {
  /** Typed request body — will be JSON.stringify'd */
  body?: unknown;
  /** Query params merged into the URL */
  params?: Record<string, string | number | boolean | undefined | null>;
  /** Override max retries for this request */
  maxRetries?: number;
  /** Skip auth token injection */
  skipAuth?: boolean;
}

// ── In-flight deduplication ────────────────────────────────────────────────

const inflight = new Map<string, Promise<unknown>>();

// ── Client factory ─────────────────────────────────────────────────────────

export function createApiClient(config: ApiClientConfig) {
  const {
    baseUrl,
    getToken,
    defaultHeaders = {},
    maxRetries = 2,
    timeout = 10_000,
  } = config;

  async function request<T>(
    path: string,
    options: ApiRequestOptions = {},
  ): Promise<T> {
    const {
      body,
      params,
      skipAuth = false,
      maxRetries: perRequestRetries,
      ...fetchOptions
    } = options;

    // Build URL
    const url = new URL(`${baseUrl}${path}`);
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        if (v !== null && v !== undefined) {
          url.searchParams.set(k, String(v));
        }
      }
    }

    // Build headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...defaultHeaders,
    };

    if (!skipAuth && getToken) {
      const token = await getToken();
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }

    const retries = perRequestRetries ?? maxRetries;

    // Only deduplicate GET requests
    const isGet = !fetchOptions.method || fetchOptions.method.toUpperCase() === 'GET';
    const cacheKey = isGet ? url.toString() : null;

    if (cacheKey && inflight.has(cacheKey)) {
      return inflight.get(cacheKey) as Promise<T>;
    }

    const execute = async (): Promise<T> => {
      let lastError: unknown;

      for (let attempt = 0; attempt <= retries; attempt++) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeout);

        try {
          const res = await fetch(url.toString(), {
            ...fetchOptions,
            headers: { ...headers, ...fetchOptions.headers as Record<string, string> },
            body:    body !== undefined ? JSON.stringify(body) : undefined,
            signal:  controller.signal,
          });

          clearTimeout(timer);

          if (!res.ok) {
            let errorBody: unknown;
            try { errorBody = await res.json(); } catch { errorBody = null; }
            throw new ApiError(
              `API ${res.status}: ${res.statusText}`,
              res.status,
              errorBody,
            );
          }

          // 204 No Content
          if (res.status === 204) return undefined as T;

          return await res.json() as T;
        } catch (err) {
          clearTimeout(timer);
          lastError = err;

          // Don't retry on client errors or aborts
          if (err instanceof ApiError && err.status < 500) throw err;
          if (err instanceof DOMException && err.name === 'AbortError') throw err;

          if (attempt < retries) {
            // Exponential back-off: 200ms, 400ms, 800ms…
            await new Promise((r) => setTimeout(r, 200 * Math.pow(2, attempt)));
          }
        }
      }

      throw lastError;
    };

    const promise = execute().finally(() => {
      if (cacheKey) inflight.delete(cacheKey);
    });

    if (cacheKey) inflight.set(cacheKey, promise);

    return promise;
  }

  // ── Convenience methods ──────────────────────────────────────────────────

  return {
    get:    <T>(path: string, opts?: ApiRequestOptions) =>
      request<T>(path, { ...opts, method: 'GET' }),

    post:   <T>(path: string, body?: unknown, opts?: ApiRequestOptions) =>
      request<T>(path, { ...opts, method: 'POST', body }),

    put:    <T>(path: string, body?: unknown, opts?: ApiRequestOptions) =>
      request<T>(path, { ...opts, method: 'PUT', body }),

    patch:  <T>(path: string, body?: unknown, opts?: ApiRequestOptions) =>
      request<T>(path, { ...opts, method: 'PATCH', body }),

    delete: <T>(path: string, opts?: ApiRequestOptions) =>
      request<T>(path, { ...opts, method: 'DELETE' }),

    /** Raw request for advanced use */
    request,
  };
}

export type RypApiClient = ReturnType<typeof createApiClient>;
