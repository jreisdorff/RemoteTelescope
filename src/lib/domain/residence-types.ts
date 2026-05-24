export const DEFAULT_USER_ID = "default";

export interface ResidenceState {
  userId: string;
  targetId: string;
  lastLocation: string;
  aCalendar: string;
  bCalendar: string;
  inventory: string[];
  updatedAt: string;
}
