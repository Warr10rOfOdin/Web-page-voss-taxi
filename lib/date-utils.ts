/**
 * Format a date in local timezone for Taxi4U API
 * Returns format: YYYY-MM-DDTHH:mm:ss (without Z suffix)
 * This ensures the time is interpreted correctly by the dispatch system
 */
export function formatDateForTaxi4U(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

/**
 * Round a date to the nearest 5-minute increment
 */
export function roundToNearest5Minutes(date: Date): Date {
  const minutes = date.getMinutes();
  const remainder = minutes % 5;
  const roundedMinutes = remainder >= 2.5 ? minutes + (5 - remainder) : minutes - remainder;

  const newDate = new Date(date);
  newDate.setMinutes(roundedMinutes);
  newDate.setSeconds(0);
  newDate.setMilliseconds(0);

  return newDate;
}
