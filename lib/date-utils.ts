/**
 * Serialize a Date for the WebAPIBook API.
 * Returns ISO 8601 UTC with the trailing Z, e.g. 2025-06-15T14:30:00.000Z.
 * The booking API rejects values that are not UTC.
 */
export function formatDateForTaxi4U(date: Date): string {
  return date.toISOString();
}

/**
 * Format a Date as an HTML <input type="datetime-local"> value in LOCAL time:
 * YYYY-MM-DDTHH:mm. The native input parses this back as local time.
 */
export function toLocalDateTimeInputValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}`
  );
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
