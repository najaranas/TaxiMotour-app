/**
 * Formats distance in a user-friendly way
 * @param distanceInMeters - Distance in meters
 * @returns Formatted distance object with value and unit
 */
export const formatDistance = (distanceInMeters: string | number) => {
  const distance = Math.round(Number(distanceInMeters));
  if (distance >= 1000) {
    return {
      value: (distance / 1000).toFixed(1),
      unit: "km",
    };
  }
  return {
    value: Math.round(distance).toString(),
    unit: "m",
  };
};

/**
 * Formats duration in minutes and seconds
 * @param durationInSeconds - Duration in seconds
 * @returns Formatted duration string
 */
export const formatDuration = (durationInSeconds: number): string => {
  const minutes = Math.floor(durationInSeconds / 60);
  const seconds = durationInSeconds % 60;

  if (minutes > 0) {
    return `${minutes}min ${seconds > 0 ? `${seconds}s` : ""}`.trim();
  }
  return `${seconds}s`;
};

/**
 * Formats date for display
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
export const formatRideDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};
