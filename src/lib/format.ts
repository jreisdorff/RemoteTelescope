export function formatLightLag(seconds: number): string {
  if (seconds < 60) {
    return `${Math.round(seconds)} seconds`;
  }
  if (seconds < 3600) {
    const minutes = Math.round(seconds / 60);
    return `${minutes} minute${minutes === 1 ? "" : "s"}`;
  }
  if (seconds < 86400) {
    const hours = Math.round(seconds / 3600);
    return `${hours} hour${hours === 1 ? "" : "s"}`;
  }
  if (seconds < 365.25 * 86400) {
    const days = Math.round(seconds / 86400);
    return `${days} day${days === 1 ? "" : "s"}`;
  }
  const years = Math.round(seconds / (365.25 * 86400));
  return `${years} year${years === 1 ? "" : "s"}`;
}

export function formatDistance(distanceLy: number): string {
  if (distanceLy < 0.001) {
    const au = distanceLy * 63241;
    return `${au.toFixed(1)} AU`;
  }
  if (distanceLy < 1) {
    return `${(distanceLy * 1000).toFixed(0)} milliparsec-scale (${distanceLy.toFixed(6)} ly)`;
  }
  return `${distanceLy.toFixed(0)} light-years`;
}

export function formatEmissionTime(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(new Date(iso)) + " UTC";
}
