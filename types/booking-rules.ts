export type RuleType = 'restriction' | 'disclaimer' | 'warning';
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface TimeRange {
  start: string; // HH:mm format
  end: string; // HH:mm format
}

export interface BookingRule {
  id: string;
  type: RuleType;
  name: string;
  description: string;
  active: boolean;

  // Time constraints
  timeRanges?: TimeRange[];
  daysOfWeek?: DayOfWeek[];

  // Date constraints
  startDate?: string; // ISO date
  endDate?: string; // ISO date

  // Display settings
  messageNo: string; // Norwegian message
  messageEn: string; // English message
  blockBooking: boolean; // If true, completely blocks booking during this time

  createdAt: string;
  updatedAt: string;
}

export interface BookingRulesConfig {
  rules: BookingRule[];
  lastUpdated: string;
}
