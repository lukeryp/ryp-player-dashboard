import { z } from 'zod';

// ── Profile ────────────────────────────────────────────────────────────────

export const ProfileSchema = z.object({
  id:           z.string().uuid(),
  name:         z.string(),
  photo_url:    z.string().url().nullable(),
  handicap:     z.number().nullable(),
  club:         z.string().nullable(),
  member_since: z.string(), // ISO date
});
export type Profile = z.infer<typeof ProfileSchema>;

// ── Red: Rounds & Holes ────────────────────────────────────────────────────

export const RoundSchema = z.object({
  id:          z.string().uuid(),
  player_id:   z.string().uuid(),
  date:        z.string(),
  course_name: z.string(),
  total_score: z.number().int(),
  par:         z.number().int(),
  ssl:         z.number().nullable(), // Scorecard Score Line
  esl:         z.number().nullable(), // Expected Score Line
  created_at:  z.string(),
});
export type Round = z.infer<typeof RoundSchema>;

export const HoleSchema = z.object({
  id:               z.string().uuid(),
  round_id:         z.string().uuid(),
  hole_number:      z.number().int(),
  par:              z.number().int(),
  score:            z.number().int(),
  fairway_hit:      z.boolean().nullable(),
  gir:              z.boolean(),
  putts:            z.number().int(),
  driving_distance: z.number().nullable(),
});
export type Hole = z.infer<typeof HoleSchema>;

// ── FORGE: Sessions & Drills ───────────────────────────────────────────────

export const ForgeSessionSchema = z.object({
  id:                    z.string().uuid(),
  player_id:             z.string().uuid(),
  date:                  z.string(),
  ryp_performance_index: z.number(), // 0–100 composite
  notes:                 z.string().nullable(),
  created_at:            z.string(),
});
export type ForgeSession = z.infer<typeof ForgeSessionSchema>;

export const ForgeDrillCategorySchema = z.enum([
  'driving',
  'approach',
  'chipping',
  'putting',
]);
export type ForgeDrillCategory = z.infer<typeof ForgeDrillCategorySchema>;

export const ForgeDrillSchema = z.object({
  id:         z.string().uuid(),
  session_id: z.string().uuid(),
  category:   ForgeDrillCategorySchema,
  drill_name: z.string(),
  score:      z.number(), // 0–100
  created_at: z.string(),
});
export type ForgeDrill = z.infer<typeof ForgeDrillSchema>;

// ── CHIP: Workouts & Exercises ─────────────────────────────────────────────

export const WorkoutSchema = z.object({
  id:               z.string().uuid(),
  player_id:        z.string().uuid(),
  date:             z.string(),
  duration_minutes: z.number().int(),
  title:            z.string(),
  category:         z.string(),
  created_at:       z.string(),
});
export type Workout = z.infer<typeof WorkoutSchema>;

export const ExerciseSchema = z.object({
  id:         z.string().uuid(),
  workout_id: z.string().uuid(),
  name:       z.string(),
  category:   z.string(),
  sets:       z.number().int(),
  reps:       z.number().int(),
  weight:     z.number().nullable(),
});
export type Exercise = z.infer<typeof ExerciseSchema>;

// ── Practice DNA ───────────────────────────────────────────────────────────

export const PersonaSchema = z.enum(['Scientist', 'Engineer', 'Warrior', 'Artist']);
export type Persona = z.infer<typeof PersonaSchema>;

export const PracticeAssessmentSchema = z.object({
  id:                    z.string().uuid(),
  player_id:             z.string().uuid(),
  created_at:            z.string(),
  persona:               PersonaSchema,
  neuro_signature:       z.string(),
  master_archetype:      z.string(),
  // Zone health (0–100 each)
  zone_assembly:         z.number(),
  zone_lab:              z.number(),
  zone_crucible:         z.number(),
  zone_arena:            z.number(),
  // OCEAN Big Five (0–100 each)
  ocean_openness:         z.number(),
  ocean_conscientiousness: z.number(),
  ocean_extraversion:    z.number(),
  ocean_agreeableness:   z.number(),
  ocean_neuroticism:     z.number(),
});
export type PracticeAssessment = z.infer<typeof PracticeAssessmentSchema>;
