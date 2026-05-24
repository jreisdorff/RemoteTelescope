export const VIEWING_STEPS = [
  {
    id: "orientation",
    title: "Orientation",
    prompt: "Fix the anchor. Name the target and note the emission epoch before impressions arrive.",
  },
  {
    id: "impressions",
    title: "Impressions",
    prompt: "Record first contact: color, motion, scale. Do not interpret yet.",
  },
  {
    id: "qualia",
    title: "Qualia tags",
    prompt: "Tag specific regions with structured qualia the mirror cannot resolve.",
  },
  {
    id: "narrative",
    title: "Narrative",
    prompt: "Free-text closure: agents, emotion, sequence of events.",
  },
] as const;

export type ViewingStepId = (typeof VIEWING_STEPS)[number]["id"];

export const QUALIA_KINDS = [
  { value: "color", label: "Color" },
  { value: "weather", label: "Weather" },
  { value: "terrain", label: "Terrain" },
  { value: "emotion", label: "Emotion" },
  { value: "narrative", label: "Narrative" },
  { value: "agent", label: "Agent" },
] as const;
