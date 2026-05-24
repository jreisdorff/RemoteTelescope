export type QualiaStatus = "provisional" | "canon" | "struck";

export type ProvenanceSource = "catoptric" | "rv" | "inferred";

export type QualiaKind =
  | "color"
  | "weather"
  | "terrain"
  | "emotion"
  | "narrative"
  | "agent";

export interface Target {
  id: string;
  name: string;
  distanceLy: number;
  /** Mean one-way light travel time in seconds */
  lightLagSeconds: number;
  description: string;
}

export interface RegionConfidence {
  regionId: string;
  label: string;
  confidence: number;
}

export interface AnchorPacket {
  targetId: string;
  tEmission: string;
  tObserved: string;
  baseColor: string;
  atmosphereHint: string;
  regions: RegionConfidence[];
}

export interface QualiaField {
  regionId: string;
  kind: QualiaKind;
  value: string;
}

export interface QualiaPacket {
  anchorRef: string;
  sessionId: string;
  qualia: QualiaField[];
  status: QualiaStatus;
  createdAt: string;
}

export interface MergedRegion {
  regionId: string;
  label: string;
  confidence: number;
  source: ProvenanceSource;
  qualia: QualiaField[];
}

export interface ExperienceInstance {
  targetId: string;
  layers: ("L0" | "L1" | "L2")[];
  baseColor: string;
  atmosphereHint: string;
  regions: MergedRegion[];
}
