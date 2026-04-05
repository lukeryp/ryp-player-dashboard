/**
 * RYP Shared Zod Schemas
 *
 * Single source of truth for domain types used across all apps.
 * Import the inferred TypeScript types via `z.infer<typeof SchemaName>`.
 */

import { z } from 'zod';

// ── Primitives ─────────────────────────────────────────────────────────────

/** UUID v4 string */
export const UUIDSchema = z.string().uuid();

/** ISO-8601 date-time string stored as UTC in DB */
export const DateTimeSchema = z.string().datetime({ offset: true });

/** YYYY-MM-DD local date string */
export const DateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected YYYY-MM-DD');

// ── Player / Profile ───────────────────────────────────────────────────────

export const HandednessSchema = z.enum(['right', 'left']);

export const PlayerSchema = z.object({
  id:          UUIDSchema,
  userId:      UUIDSchema,
  displayName: z.string().min(1).max(80),
  handicap:    z.number().min(-10).max(54).nullable(),
  handedness:  HandednessSchema.default('right'),
  homeCourseId: UUIDSchema.nullable(),
  createdAt:   DateTimeSchema,
  updatedAt:   DateTimeSchema,
});

export type Player = z.infer<typeof PlayerSchema>;

// ── Course ─────────────────────────────────────────────────────────────────

export const CourseSchema = z.object({
  id:       UUIDSchema,
  name:     z.string().min(1).max(120),
  city:     z.string().max(80).optional(),
  state:    z.string().max(80).optional(),
  country:  z.string().max(80).default('USA'),
  rating:   z.number().min(55).max(85).nullable(),
  slope:    z.number().min(55).max(155).nullable(),
  par:      z.number().min(60).max(80).default(72),
  holes:    z.literal(9).or(z.literal(18)).default(18),
  createdAt: DateTimeSchema,
});

export type Course = z.infer<typeof CourseSchema>;

// ── Club ──────────────────────────────────────────────────────────────────

export const ClubTypeSchema = z.enum([
  'driver', 'wood', 'hybrid', 'iron', 'wedge', 'putter',
]);

export const ClubSchema = z.object({
  id:          UUIDSchema,
  playerId:    UUIDSchema,
  name:        z.string().min(1).max(60),
  type:        ClubTypeSchema,
  loft:        z.number().min(4).max(72).nullable(),
  avgDistance: z.number().min(0).max(400).nullable(), // yards
  notes:       z.string().max(500).optional(),
  createdAt:   DateTimeSchema,
});

export type Club = z.infer<typeof ClubSchema>;
export type ClubType = z.infer<typeof ClubTypeSchema>;

// ── Round ─────────────────────────────────────────────────────────────────

export const TeeColorSchema = z.enum(['black', 'blue', 'white', 'gold', 'red', 'green']);

export const RoundSchema = z.object({
  id:          UUIDSchema,
  playerId:    UUIDSchema,
  courseId:    UUIDSchema,
  playedDate:  DateSchema,
  teeColor:    TeeColorSchema.default('white'),
  totalScore:  z.number().int().min(50).max(200),
  totalPutts:  z.number().int().min(0).max(100).nullable(),
  fairwaysHit: z.number().int().min(0).max(18).nullable(),
  greensInReg: z.number().int().min(0).max(18).nullable(),
  notes:       z.string().max(1000).optional(),
  createdAt:   DateTimeSchema,
  updatedAt:   DateTimeSchema,
});

export type Round = z.infer<typeof RoundSchema>;
export type TeeColor = z.infer<typeof TeeColorSchema>;

// ── Hole Score ─────────────────────────────────────────────────────────────

export const HoleScoreSchema = z.object({
  id:         UUIDSchema,
  roundId:    UUIDSchema,
  holeNumber: z.number().int().min(1).max(18),
  par:        z.number().int().min(3).max(5),
  strokes:    z.number().int().min(1).max(20),
  putts:      z.number().int().min(0).max(10).nullable(),
  fairwayHit: z.boolean().nullable(),
  girHit:     z.boolean().nullable(),
  clubUsed:   UUIDSchema.nullable(),
  notes:      z.string().max(300).optional(),
});

export type HoleScore = z.infer<typeof HoleScoreSchema>;

// ── Score relative to par helpers ─────────────────────────────────────────

export const ScoreRelativeSchema = z.enum([
  'eagle_or_better', 'birdie', 'par', 'bogey', 'double', 'triple_or_worse',
]);

export type ScoreRelative = z.infer<typeof ScoreRelativeSchema>;

export function getScoreRelative(strokes: number, par: number): ScoreRelative {
  const diff = strokes - par;
  if (diff <= -2) return 'eagle_or_better';
  if (diff === -1) return 'birdie';
  if (diff === 0)  return 'par';
  if (diff === 1)  return 'bogey';
  if (diff === 2)  return 'double';
  return 'triple_or_worse';
}

// ── Swing / FORGE ──────────────────────────────────────────────────────────

export const SwingPlaneSchema = z.enum(['flat', 'neutral', 'upright']);
export const SwingTempoSchema = z.enum(['slow', 'moderate', 'fast']);

export const SwingAnalysisSchema = z.object({
  id:            UUIDSchema,
  playerId:      UUIDSchema,
  sessionDate:   DateSchema,
  plane:         SwingPlaneSchema.nullable(),
  tempo:         SwingTempoSchema.nullable(),
  parallelScore: z.number().min(0).max(100).nullable(),
  forgeScore:    z.number().min(0).max(100).nullable(),
  notes:         z.string().max(2000).optional(),
  videoUrl:      z.string().url().nullable(),
  createdAt:     DateTimeSchema,
});

export type SwingAnalysis = z.infer<typeof SwingAnalysisSchema>;

// ── API pagination ─────────────────────────────────────────────────────────

export const PaginationSchema = z.object({
  page:    z.number().int().min(1).default(1),
  perPage: z.number().int().min(1).max(100).default(20),
  total:   z.number().int().min(0),
});

export type Pagination = z.infer<typeof PaginationSchema>;

export function paginatedSchema<T extends z.ZodTypeAny>(itemSchema: T) {
  return z.object({
    data:       z.array(itemSchema),
    pagination: PaginationSchema,
  });
}
