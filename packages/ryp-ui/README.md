# @ryp/ui

Shared component library for all RYP Golf applications — Red, FORGE, Known, Kudo, CHIP, Practice DNA, Cert.

## Brand Tokens

| Token | Value |
|---|---|
| Green (primary) | `#00af51` |
| Yellow (accent) | `#f4ee19` |
| Black (background) | `#000000` |
| White (text) | `#ffffff` |
| Heading font | Raleway Bold |
| Body font | Work Sans |

---

## Setup (consuming app)

### 1. Install dependencies (in your app)

```bash
npm install clsx tailwind-merge zod @supabase/supabase-js recharts
```

### 2. Link the package

In your app's `package.json`:

```json
{
  "dependencies": {
    "@ryp/ui": "file:../../ryp-ui"
  }
}
```

Then `npm install`.

### 3. Tailwind config

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss';
import rypPreset from '@ryp/ui/tailwind';

const config: Config = {
  presets: [rypPreset],
  content: [
    './src/**/*.{ts,tsx}',
    '../../ryp-ui/src/**/*.{ts,tsx}', // pick up ryp-ui classes
  ],
};

export default config;
```

### 4. Global CSS

```css
/* globals.css */
@import '@ryp/ui/styles';
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 5. Toast provider (app root / layout)

```tsx
// app/layout.tsx
import { ToastProvider } from '@ryp/ui';

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
```

---

## Components

### GlassCard

```tsx
import { GlassCard } from '@ryp/ui';

<GlassCard variant="green" padding="lg" hoverable>
  <p>Content</p>
</GlassCard>
```

Props: `variant` (`default` | `green` | `yellow` | `danger`), `padding` (`none` | `sm` | `md` | `lg` | `xl`), `hoverable`, `as`, `className`.

---

### Button

```tsx
import { Button } from '@ryp/ui';

<Button variant="primary" size="md" loading={isSaving}>
  Save Round
</Button>

<Button variant="secondary" iconLeft={<PlusIcon />}>
  Add Club
</Button>

<Button variant="danger" onClick={handleDelete}>Delete</Button>
<Button variant="ghost">Cancel</Button>
```

Props: `variant` (`primary` | `secondary` | `danger` | `ghost` | `link`), `size` (`xs`–`xl`), `loading`, `iconLeft`, `iconRight`, `fullWidth`.

---

### Input

```tsx
import { Input } from '@ryp/ui';

<Input
  label="Handicap"
  type="number"
  min={0}
  max={54}
  error={errors.handicap?.message}
  hint="Your current USGA index"
/>
```

Props: `label`, `hint`, `error`, `prefix`, `suffix`, `size` (`sm` | `md` | `lg`), `fullWidth`. Forwards all native `<input>` props.

---

### Select

```tsx
import { Select } from '@ryp/ui';

<Select
  label="Tee"
  options={[
    { value: 'blue',  label: 'Blue' },
    { value: 'white', label: 'White' },
    { value: 'red',   label: 'Red' },
  ]}
  value={tee}
  onChange={(e) => setTee(e.target.value)}
/>
```

---

### Modal

```tsx
import { Modal, Button } from '@ryp/ui';

<Modal
  open={isOpen}
  onClose={() => setIsOpen(false)}
  title="Edit Round"
  size="md"
  footer={
    <>
      <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
      <Button variant="primary" loading={saving}>Save</Button>
    </>
  }
>
  <p>Modal body content</p>
</Modal>
```

Traps focus, handles Escape, restores focus on close.

---

### Toast

```tsx
import { useToast } from '@ryp/ui';

function MyComponent() {
  const { toast } = useToast();

  const handleSave = async () => {
    await saveRound();
    toast({ variant: 'success', title: 'Round saved!', message: 'Your stats have been updated.' });
  };
}
```

Variants: `success` | `error` | `warning` | `info`. Set `duration: 0` for sticky.

---

### LoadingSpinner

```tsx
import { LoadingSpinner } from '@ryp/ui';

<LoadingSpinner size="md" variant="green" />
<LoadingSpinner fullPage label="Loading your round..." />
```

---

### EmptyState

```tsx
import { EmptyState } from '@ryp/ui';

<EmptyState
  title="No rounds yet"
  description="Log your first round to start tracking your game."
  action={{ label: 'Log Round', onClick: () => router.push('/rounds/new') }}
/>
```

---

### PageHeader

```tsx
import { PageHeader } from '@ryp/ui';
import Link from 'next/link';

<PageHeader
  title="Round Detail"
  subtitle="Augusta National · Apr 3, 2026"
  breadcrumbs={[
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Rounds',    href: '/rounds' },
    { label: 'Apr 3, 2026' },
  ]}
  actions={<Button size="sm">Export</Button>}
  LinkComponent={Link}
  bordered
/>
```

---

### StatCard

```tsx
import { StatCard } from '@ryp/ui';

<StatCard
  label="Fairways Hit"
  value="64%"
  trend="+3.2%"
  trendDirection="up"
  variant="green"
  subLabel="Last 10 rounds"
/>
```

---

### ErrorBoundary

```tsx
import { ErrorBoundary } from '@ryp/ui';

<ErrorBoundary onError={(err) => logToSentry(err)}>
  <RiskyComponent />
</ErrorBoundary>

// Custom fallback:
<ErrorBoundary fallback={({ error, reset }) => (
  <div>
    <p>{error.message}</p>
    <button onClick={reset}>Retry</button>
  </div>
)}>
  ...
</ErrorBoundary>
```

---

### Charts

```tsx
import { RypLineChart, RypBarChart, RypAreaChart, RypRadarChart, RypPieChart } from '@ryp/ui';

<RypLineChart
  data={roundHistory}
  xKey="date"
  series={[
    { dataKey: 'score',  name: 'Total Score', color: '#00af51' },
    { dataKey: 'putts',  name: 'Putts' },
  ]}
  height={300}
  valueFormatter={(v) => `${v} strokes`}
/>

<RypPieChart
  data={[
    { name: 'Birdies', value: 12, color: '#00af51' },
    { name: 'Pars',    value: 48, color: '#f4ee19' },
    { name: 'Bogeys',  value: 30, color: '#a3a3a3' },
  ]}
/>
```

All charts: dark-theme defaults, branded tooltip, consistent axis styling.

---

## Utilities

### Zod Schemas

```ts
import { RoundSchema, PlayerSchema, type Round, type Player } from '@ryp/ui';

const round = RoundSchema.parse(rawData); // throws if invalid
```

Available schemas: `PlayerSchema`, `CourseSchema`, `ClubSchema`, `RoundSchema`, `HoleScoreSchema`, `SwingAnalysisSchema`.

### Date Formatting

```ts
import { formatDate, formatRelative, todayISO, seasonLabel } from '@ryp/ui';

formatDate('2026-04-03T14:00:00Z')  // "Apr 3, 2026"
formatRelative('2026-04-03T12:00Z') // "2h ago"
todayISO()                           // "2026-04-05"
seasonLabel(new Date())              // "Spring 2026"
```

### Number Formatting

```ts
import { formatScoreToPar, formatHandicap, formatHitPercent, formatYards } from '@ryp/ui';

formatScoreToPar(74, 72)    // "+2"
formatScoreToPar(70, 72)    // "-2"
formatScoreToPar(72, 72)    // "E"
formatHandicap(4.5)          // "4.5"
formatHandicap(-2)           // "+2.0"
formatHitPercent(11, 14)     // "78.6%"
formatYards(285)             // "285 yds"
```

### API Client

```ts
import { createApiClient } from '@ryp/ui';

const api = createApiClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL!,
  getToken: async () => {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? null;
  },
});

const rounds = await api.get<Round[]>('/rounds', { params: { playerId: id } });
await api.post('/rounds', { courseId, score: 74 });
```

### Supabase Client

```ts
// lib/supabase.ts (in each app)
import { createRypClient, createRypServerClient } from '@ryp/ui';

// Browser / Client Component
export const supabase = createRypClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

// Server Component / Route Handler
export const supabaseAdmin = createRypServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// Helper
import { unwrap } from '@ryp/ui';
const rounds = await unwrap(supabase.from('rounds').select('*'));
```

---

## Accessibility

Every component:
- Correct ARIA roles and labels
- Keyboard navigable (Tab, Shift+Tab, Enter, Escape)
- Focus ring using `ryp-green` outline on `focus-visible`
- `sr-only` labels where visual label is suppressed
- Error states announced via `role="alert"`
- Modal traps focus and restores on close
