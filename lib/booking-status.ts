/**
 * Taxi4U Booking Status Codes
 *
 * Based on the Taxi4U API status codes used across the system
 * Supports both full status code lookup and last-character-based identification
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
  type: 'active' | 'pending' | 'cancelled' | 'completed' | 'unknown';
  canDelete: boolean;
  canGetReceipt?: boolean;
  icon: string;
  lastChar?: string;
}

/**
 * Status code mappings from Taxi4U API
 */
export const STATUS_CODES: Record<string, StatusInfo> = {
  // Cancelled/Deleted statuses
  'A0': {
    code: 'A0',
    lastChar: '0',
    label: { no: 'Avbestilt/Sletta', en: 'Cancelled/Deleted' },
    description: { no: 'Denne turen er avbestilt/sletta', en: 'This trip has been cancelled/deleted' },
    type: 'cancelled',
    canDelete: false,
    canGetReceipt: false,
    icon: '❌'
  },
  'CA': {
    code: 'CA',
    lastChar: 'A',
    label: { no: 'Avbestilt', en: 'Cancelled' },
    description: { no: 'Denne turen er avbestilt', en: 'This trip has been cancelled' },
    type: 'cancelled',
    canDelete: false,
    canGetReceipt: false,
    icon: '❌'
  },

  // Pending/Unassigned statuses
  'AU': {
    code: 'AU',
    lastChar: 'U',
    label: { no: 'Ventar på taxi', en: 'Awaiting Taxi' },
    description: { no: 'Venter på at ein taxi skal akseptere turen', en: 'Waiting for a taxi to accept the trip' },
    type: 'pending',
    canDelete: true,
    canGetReceipt: false,
    icon: '⏳'
  },
  'OP': {
    code: 'OP',
    lastChar: 'P',
    label: { no: 'Åpen', en: 'Open' },
    description: { no: 'Bestillinga er registrert og venter', en: 'Booking is registered and waiting' },
    type: 'pending',
    canDelete: true,
    canGetReceipt: false,
    icon: '⏳'
  },
  'BUGIMN': {
    code: 'BUGIMN',
    lastChar: 'N',
    label: { no: 'Under behandling', en: 'Under Review' },
    description: { no: 'Bestillinga er under behandling av systemet', en: 'Booking is being processed by the system' },
    type: 'pending',
    canDelete: true,
    canGetReceipt: false,
    icon: '🔄'
  },
  'AUGIMN': {
    code: 'AUGIMN',
    lastChar: 'N',
    label: { no: 'Ventar på behandling', en: 'Awaiting Processing' },
    description: { no: 'Bestillinga ventar på å bli behandla av systemet', en: 'Booking is awaiting system processing' },
    type: 'pending',
    canDelete: true,
    canGetReceipt: false,
    icon: '⏳'
  },

  // Assigned/Active statuses
  'AS': {
    code: 'AS',
    lastChar: 'S',
    label: { no: 'Taxi tildelt', en: 'Taxi Assigned' },
    description: { no: 'Ein taxi er tildelt turen din', en: 'A taxi has been assigned to your trip' },
    type: 'active',
    canDelete: false,
    canGetReceipt: false,
    icon: '🚕'
  },
  'AC': {
    code: 'AC',
    lastChar: 'C',
    label: { no: 'Akseptert', en: 'Accepted' },
    description: { no: 'Taxi har akseptert turen', en: 'Taxi has accepted the trip' },
    type: 'active',
    canDelete: false,
    canGetReceipt: false,
    icon: '✅'
  },
  'EN': {
    code: 'EN',
    lastChar: 'N',
    label: { no: 'På veg', en: 'En Route' },
    description: { no: 'Taxi er på veg til henting', en: 'Taxi is on the way to pickup' },
    type: 'active',
    canDelete: false,
    canGetReceipt: false,
    icon: '🚖'
  },
  'AR': {
    code: 'AR',
    lastChar: 'R',
    label: { no: 'Framme', en: 'Arrived' },
    description: { no: 'Taxi har kome fram til hentestaden', en: 'Taxi has arrived at pickup location' },
    type: 'active',
    canDelete: false,
    canGetReceipt: false,
    icon: '📍'
  },
  'PU': {
    code: 'PU',
    lastChar: 'U',
    label: { no: 'Passasjer om bord', en: 'Passenger On Board' },
    description: { no: 'Passasjer er om bord, turen pågår', en: 'Passenger is on board, trip in progress' },
    type: 'active',
    canDelete: false,
    canGetReceipt: false,
    icon: '🚗'
  },

  // Completed statuses
  'CO': {
    code: 'CO',
    lastChar: 'O',
    label: { no: 'Fullført', en: 'Completed' },
    description: { no: 'Turen er fullført', en: 'Trip has been completed' },
    type: 'completed',
    canDelete: false,
    canGetReceipt: true,
    icon: '✅'
  },
  'FI': {
    code: 'FI',
    lastChar: 'I',
    label: { no: 'Ferdig', en: 'Finished' },
    description: { no: 'Turen er ferdig', en: 'Trip is finished' },
    type: 'completed',
    canDelete: false,
    canGetReceipt: true,
    icon: '🏁'
  }
};

/**
 * Get status information for a given status code
 */
export function getStatusInfo(statusCode: string | undefined): StatusInfo {
  if (!statusCode) {
    return {
      code: 'UNKNOWN',
      label: { no: 'Ukjent', en: 'Unknown' },
      description: { no: 'Status er ukjent', en: 'Status is unknown' },
      type: 'unknown',
      canDelete: false,
      icon: '❓'
    };
  }

  const status = STATUS_CODES[statusCode.toUpperCase()];

  if (!status) {
    // Return unknown status with the actual code
    return {
      code: statusCode,
      label: { no: `Status: ${statusCode}`, en: `Status: ${statusCode}` },
      description: { no: 'Ukjent status', en: 'Unknown status' },
      type: 'unknown',
      canDelete: false,
      icon: '❓'
    };
  }

  return status;
}

/**
 * Get status information by last character
 * Useful for quick status type identification
 * Note: Some last characters map to multiple status codes
 */
export function getStatusByLastChar(statusCode: string | undefined): StatusInfo | null {
  if (!statusCode || statusCode.length === 0) return null;

  const lastChar = statusCode.toUpperCase().slice(-1);

  // Find first status code that matches the last character
  for (const [code, info] of Object.entries(STATUS_CODES)) {
    if (info.lastChar === lastChar) {
      return info;
    }
  }

  return null;
}

/**
 * Get the display color class for a status type
 */
export function getStatusColorClass(type: StatusInfo['type']): string {
  switch (type) {
    case 'active':
      return 'bg-green-900/20 border-green-500/50 text-green-300';
    case 'pending':
      return 'bg-yellow-900/20 border-yellow-500/50 text-yellow-300';
    case 'cancelled':
      return 'bg-red-900/20 border-red-500/50 text-red-300';
    case 'completed':
      return 'bg-blue-900/20 border-blue-500/50 text-blue-300';
    case 'unknown':
      return 'bg-gray-900/20 border-gray-500/50 text-gray-300';
    default:
      return 'bg-gray-900/20 border-gray-500/50 text-gray-300';
  }
}
