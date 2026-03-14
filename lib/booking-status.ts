/**
 * Taxi4U Booking Status Codes
 *
 * IMPORTANT: Status codes are SEQUENCES (e.g., "BUGIMN")
 * The LAST CHARACTER represents the CURRENT status
 * Each character in the sequence represents a status the booking has gone through
 *
 * Based on the Excel spreadsheet from Taxi4U system
 */

export interface StatusInfo {
  code: string;
  label: {
    no: string;
    en: string;
  };
  description: {
    no: string;
    en: string;
  };
  type: 'payment' | 'process' | 'sent' | 'response' | 'completed' | 'changed' | 'cancelled' | 'unknown';
  canDelete: boolean;
  canGetReceipt?: boolean;
  showLoyve?: boolean; // Show license/car number for this status
  icon: string;
}

/**
 * Status code mappings from Taxi4U API (vogn = 0, booking statuses)
 * Each letter can appear in a status sequence like "BUGIMN"
 */
export const STATUS_CODES: Record<string, StatusInfo> = {
  // Payment method statuses
  'A': {
    code: 'A',
    label: { no: 'Kontant', en: 'Paid in Car' },
    description: { no: 'Betaling i bil (kontant/kort)', en: 'Paid in car (cash/card)' },
    type: 'payment',
    canDelete: true,
    canGetReceipt: false,
    icon: '💵'
  },
  'B': {
    code: 'B',
    label: { no: 'Kreditt', en: 'Credit' },
    description: { no: 'Betaling med kreditt', en: 'Credit payment' },
    type: 'payment',
    canDelete: true,
    canGetReceipt: false,
    icon: '💳'
  },

  // Process statuses
  'c': {
    code: 'c',
    label: { no: 'Kopiert', en: 'Copied' },
    description: { no: 'Bestillinga er kopiert', en: 'Booking has been copied' },
    type: 'process',
    canDelete: true,
    canGetReceipt: false,
    icon: '📋'
  },
  'C': {
    code: 'C',
    label: { no: 'Sparsam', en: 'Economical' },
    description: { no: 'Sparsam tur (delt)', en: 'Economical trip (shared)' },
    type: 'process',
    canDelete: true,
    canGetReceipt: false,
    icon: '🤝'
  },
  'D': {
    code: 'D',
    label: { no: 'Autobook', en: 'Autobook' },
    description: { no: 'Automatisk bestilling', en: 'Automatic booking' },
    type: 'process',
    canDelete: true,
    canGetReceipt: false,
    icon: '🤖'
  },
  'E': {
    code: 'E',
    label: { no: 'Fast tur', en: 'Fixed Trip' },
    description: { no: 'Fast tur', en: 'Fixed trip' },
    type: 'process',
    canDelete: true,
    canGetReceipt: false,
    icon: '📅'
  },
  'F': {
    code: 'F',
    label: { no: 'Skoletur', en: 'School Trip' },
    description: { no: 'Skoletur', en: 'School trip' },
    type: 'process',
    canDelete: true,
    canGetReceipt: false,
    icon: '🎒'
  },

  // Sending/Communication statuses
  'G': {
    code: 'G',
    label: { no: 'Under sending', en: 'Being Sent' },
    description: { no: 'Bestillinga blir sendt til sjåfør', en: 'Booking is being sent to driver' },
    type: 'sent',
    canDelete: true,
    canGetReceipt: false,
    icon: '📤'
  },
  'h': {
    code: 'h',
    label: { no: 'Hentet', en: 'Picked Up' },
    description: { no: 'Passasjer er hentet', en: 'Passenger has been picked up' },
    type: 'process',
    canDelete: false,
    canGetReceipt: false,
    icon: '🚗'
  },
  'H': {
    code: 'H',
    label: { no: 'Ingen kontakt', en: 'No Contact' },
    description: { no: 'Ingen kontakt med sjåfør', en: 'No contact with driver' },
    type: 'sent',
    canDelete: true,
    canGetReceipt: false,
    icon: '📵'
  },

  // Response statuses
  'I': {
    code: 'I',
    label: { no: 'Ja-svar', en: 'Yes Answer' },
    description: { no: 'Bil har akseptert turen', en: 'Car has accepted the trip' },
    type: 'response',
    canDelete: false,
    canGetReceipt: false,
    showLoyve: true,
    icon: '✅'
  },
  'J': {
    code: 'J',
    label: { no: 'Nei-svar', en: 'No Answer' },
    description: { no: 'Bil har avvist turen', en: 'Car has rejected the trip' },
    type: 'response',
    canDelete: true,
    canGetReceipt: false,
    icon: '❌'
  },
  'K': {
    code: 'K',
    label: { no: 'Timeout', en: 'Timeout' },
    description: { no: 'Tidsavbrudd (ingen respons)', en: 'Timeout (no response)' },
    type: 'response',
    canDelete: true,
    canGetReceipt: false,
    icon: '⏱️'
  },

  // Delivery/Completion statuses
  'l': {
    code: 'l',
    label: { no: 'Levert', en: 'Delivered' },
    description: { no: 'Passasjer er levert', en: 'Passenger has been delivered' },
    type: 'completed',
    canDelete: false,
    canGetReceipt: true,
    icon: '🏁'
  },
  'L': {
    code: 'L',
    label: { no: 'Manuelt sendt', en: 'Manually Sent' },
    description: { no: 'Bestillinga er sendt manuelt', en: 'Booking has been sent manually' },
    type: 'sent',
    canDelete: true,
    canGetReceipt: false,
    icon: '✋'
  },
  'M': {
    code: 'M',
    label: { no: 'Ja-svar', en: 'Yes Answer' },
    description: { no: 'Bil har akseptert turen', en: 'Car has accepted the trip' },
    type: 'response',
    canDelete: false,
    canGetReceipt: false,
    showLoyve: true,
    icon: '✅'
  },
  'n': {
    code: 'n',
    label: { no: 'Noshow', en: 'No Show' },
    description: { no: 'Passasjer møtte ikke opp', en: 'Passenger did not show up' },
    type: 'completed',
    canDelete: false,
    canGetReceipt: false,
    icon: '👻'
  },
  'N': {
    code: 'N',
    label: { no: 'Klar for fakturering', en: 'Ready for Invoicing' },
    description: { no: 'Turen er ferdig og klar for fakturering', en: 'Trip is completed and ready for invoicing' },
    type: 'completed',
    canDelete: false,
    canGetReceipt: true,
    icon: '✅'
  },
  'o': {
    code: 'o',
    label: { no: 'Opptatt', en: 'Busy' },
    description: { no: 'Bil er opptatt', en: 'Car is busy' },
    type: 'response',
    canDelete: true,
    canGetReceipt: false,
    icon: '🔴'
  },
  'p': {
    code: 'p',
    label: { no: 'Pause', en: 'Pause' },
    description: { no: 'Tur satt på pause', en: 'Trip paused' },
    type: 'process',
    canDelete: true,
    canGetReceipt: false,
    icon: '⏸️'
  },

  // Change statuses
  'U': {
    code: 'U',
    label: { no: 'Endret', en: 'Changed' },
    description: { no: 'Bestillinga er endret', en: 'Booking has been changed' },
    type: 'changed',
    canDelete: true,
    canGetReceipt: false,
    icon: '✏️'
  },
  'V': {
    code: 'V',
    label: { no: 'Manuelt endret', en: 'Manually Changed' },
    description: { no: 'Bestillinga er endret manuelt', en: 'Booking has been manually changed' },
    type: 'changed',
    canDelete: true,
    canGetReceipt: false,
    icon: '✋✏️'
  },
  'x': {
    code: 'x',
    label: { no: 'Behandle manuelt', en: 'Handle Manually' },
    description: { no: 'Må behandlast manuelt', en: 'Must be handled manually' },
    type: 'process',
    canDelete: true,
    canGetReceipt: false,
    icon: '⚠️'
  },
  'X': {
    code: 'X',
    label: { no: 'Forsendt', en: 'Sent Too Early' },
    description: { no: 'Sendt for tidleg', en: 'Sent too early' },
    type: 'sent',
    canDelete: true,
    canGetReceipt: false,
    icon: '⏰'
  },

  // Cancelled status
  '0': {
    code: '0',
    label: { no: 'Avbestilt', en: 'Cancelled' },
    description: { no: 'Turen er avbestilt', en: 'Trip has been cancelled' },
    type: 'cancelled',
    canDelete: false,
    canGetReceipt: false,
    icon: '🚫'
  }
};

/**
 * Get the current status from a status sequence
 * The last character represents the current status
 *
 * @param statusCode - Full status sequence (e.g., "BUGIMN")
 * @returns StatusInfo for the current (last) status character
 */
export function getCurrentStatus(statusCode: string | undefined): StatusInfo {
  if (!statusCode || statusCode.length === 0) {
    return {
      code: 'UNKNOWN',
      label: { no: 'Ukjent', en: 'Unknown' },
      description: { no: 'Status er ukjent', en: 'Status is unknown' },
      type: 'unknown',
      canDelete: false,
      icon: '❓'
    };
  }

  // Get the last character (current status)
  const lastChar = statusCode.slice(-1);
  const status = STATUS_CODES[lastChar];

  if (!status) {
    // Return unknown status with the actual code
    return {
      code: lastChar,
      label: { no: `Status: ${lastChar}`, en: `Status: ${lastChar}` },
      description: { no: 'Ukjent status', en: 'Unknown status' },
      type: 'unknown',
      canDelete: false,
      icon: '❓'
    };
  }

  return status;
}

/**
 * Get status information for a given status code (legacy function)
 * @deprecated Use getCurrentStatus instead for status sequences
 */
export function getStatusInfo(statusCode: string | undefined): StatusInfo {
  return getCurrentStatus(statusCode);
}

/**
 * Parse a status sequence into individual statuses
 *
 * @param statusSequence - Full status sequence (e.g., "BUGIMN")
 * @returns Array of StatusInfo objects in chronological order
 */
export function parseStatusSequence(statusSequence: string | undefined): StatusInfo[] {
  if (!statusSequence || statusSequence.length === 0) return [];

  const statuses: StatusInfo[] = [];

  for (let i = 0; i < statusSequence.length; i++) {
    const char = statusSequence[i];
    const status = STATUS_CODES[char];

    if (status) {
      statuses.push(status);
    } else {
      // Include unknown statuses in the sequence
      statuses.push({
        code: char,
        label: { no: `Status: ${char}`, en: `Status: ${char}` },
        description: { no: 'Ukjent status', en: 'Unknown status' },
        type: 'unknown',
        canDelete: false,
        icon: '❓'
      });
    }
  }

  return statuses;
}

/**
 * Get status information by last character
 * @deprecated Use getCurrentStatus instead
 */
export function getStatusByLastChar(statusCode: string | undefined): StatusInfo | null {
  if (!statusCode || statusCode.length === 0) return null;
  return getCurrentStatus(statusCode);
}

/**
 * Get the display color class for a status type
 */
export function getStatusColorClass(type: StatusInfo['type']): string {
  switch (type) {
    case 'payment':
      return 'bg-purple-900/20 border-purple-500/50 text-purple-300';
    case 'process':
      return 'bg-blue-900/20 border-blue-500/50 text-blue-300';
    case 'sent':
      return 'bg-yellow-900/20 border-yellow-500/50 text-yellow-300';
    case 'response':
      return 'bg-green-900/20 border-green-500/50 text-green-300';
    case 'completed':
      return 'bg-emerald-900/20 border-emerald-500/50 text-emerald-300';
    case 'changed':
      return 'bg-orange-900/20 border-orange-500/50 text-orange-300';
    case 'cancelled':
      return 'bg-red-900/20 border-red-500/50 text-red-300';
    case 'unknown':
      return 'bg-gray-900/20 border-gray-500/50 text-gray-300';
    default:
      return 'bg-gray-900/20 border-gray-500/50 text-gray-300';
  }
}
