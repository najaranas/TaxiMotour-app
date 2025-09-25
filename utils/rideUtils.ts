import i18n from "i18next";
/**
 * Formats distance in a user-friendly way
 * @param distanceInMeters - Distance in meters
 * @returns Formatted distance object with value and unit
 */
export const formatDistance = (
  distanceInMeters: string | number | undefined
): string | "--" => {
  if (!distanceInMeters) return "--";
  const distance = Math.round(Number(distanceInMeters));
  if (distance >= 1000) {
    return `${(distance / 1000).toFixed(0)} km`;
  }
  return `${distance.toFixed(0)} m`;
};

/**
 * Formats duration in minutes and seconds
 * @param durationInSeconds - Duration in seconds
 * @returns Formatted duration string
 */
export const formatDuration = (
  durationInSeconds: string | number | undefined
): string => {
  if (!durationInSeconds) return "--";

  const duration = Math.round(Number(durationInSeconds));

  if (duration > 3600) {
    return `${(duration / 3600).toFixed(0)} h`;
  } else {
    return `${(duration / 60).toFixed(0)} min`;
  }
};

/**
 * Formats date for display
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
export const formatRideDate = (
  dateString: string | undefined
): string | "--" => {
  if (!dateString) return "--";
  const date = new Date(dateString);
  return date.toLocaleDateString(i18n.language, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

/**
 * Formats duration in minutes and seconds
 * @param durationInSeconds - Duration in seconds
 * @returns Formatted duration string
 */
export const formatFare = (
  durationInSeconds: string | number | undefined
): string => {
  if (!durationInSeconds) return "--";

  return `${Math.round(Number(durationInSeconds))} TND`;
};
