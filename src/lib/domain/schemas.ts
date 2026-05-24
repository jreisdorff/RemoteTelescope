import { z } from "zod";

export const qualiaStatusSchema = z.enum(["provisional", "canon", "struck"]);

export const provenanceSourceSchema = z.enum(["catoptric", "rv", "inferred"]);

export const qualiaKindSchema = z.enum([
  "color",
  "weather",
  "terrain",
  "emotion",
  "narrative",
  "agent",
]);

export const targetSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  distanceLy: z.number().positive(),
  lightLagSeconds: z.number().positive(),
  description: z.string(),
});

export const regionConfidenceSchema = z.object({
  regionId: z.string().min(1),
  label: z.string().min(1),
  confidence: z.number().min(0).max(1),
});

export const anchorPacketSchema = z.object({
  targetId: z.string().min(1),
  tEmission: z.string().datetime(),
  tObserved: z.string().datetime(),
  baseColor: z.string().min(1),
  atmosphereHint: z.string(),
  regions: z.array(regionConfidenceSchema).min(1),
});

export const qualiaFieldSchema = z.object({
  regionId: z.string().min(1),
  kind: qualiaKindSchema,
  value: z.string().min(1),
});

export const qualiaPacketSchema = z.object({
  anchorRef: z.string().min(1),
  sessionId: z.string().min(1),
  qualia: z.array(qualiaFieldSchema),
  status: qualiaStatusSchema,
  createdAt: z.string().datetime(),
});

export const mergedRegionSchema = z.object({
  regionId: z.string().min(1),
  label: z.string().min(1),
  confidence: z.number().min(0).max(1),
  source: provenanceSourceSchema,
  qualia: z.array(qualiaFieldSchema),
});

export const experienceInstanceSchema = z.object({
  targetId: z.string().min(1),
  layers: z.array(z.enum(["L0", "L1", "L2"])),
  baseColor: z.string().min(1),
  atmosphereHint: z.string(),
  regions: z.array(mergedRegionSchema).min(1),
});

export type TargetInput = z.infer<typeof targetSchema>;
export type AnchorPacketInput = z.infer<typeof anchorPacketSchema>;
export type QualiaPacketInput = z.infer<typeof qualiaPacketSchema>;
export type ExperienceInstanceInput = z.infer<typeof experienceInstanceSchema>;
