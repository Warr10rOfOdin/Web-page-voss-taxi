/**
 * TypeScript type definitions for the Voss Taxi booking system
 */

// ============================================================================
// Passenger Types
// ============================================================================

export interface Passenger {
  seqNo: number;
  clientName: string;
  tel: string;
  email?: string;
  fromStreet: string;
  fromCity: string;
  fromPostalCode: string;
  fromZoneNo?: number; // Auto-calculated from postal code/city
  toStreet?: string;
  toCity?: string;
  toPostalCode?: string;
  toZoneNo?: number; // Auto-calculated from postal code/city
  pickupTime: string; // ISO 8601 format
  clientNoteToCar?: boolean;
  messageToCar?: string;
}

// ============================================================================
// Booking Request Types
// ============================================================================

export interface GeneralBookingRequest {
  orderedBy: string;
  pickupTime: string; // ISO 8601 format
  carGroupId: number;
  numberOfCars: number;
  passengers: Passenger[];
}

export interface SimpleBookingRequest {
  customerName: string;
  tel: string;
  email?: string;
  fromStreet: string;
  fromCity: string;
  fromPostalCode: string;
  toStreet?: string;
  toCity?: string;
  toPostalCode?: string;
  pickupTime: string; // ISO 8601 format
  orderedBy?: string;
  messageToCar?: string;
  messageToBooking?: string;
  accountNumber?: string;
  attributes?: number[] | string;
}

// ============================================================================
// Booking Response Types
// ============================================================================

export interface BookingResponse {
  success: boolean;
  internalNo?: string;
  bookRef?: string;
  data?: any;
  error?: string;
  details?: string;
}

// ============================================================================
// Price Quote Types
// ============================================================================

export interface PriceQuoteRequest {
  fromStreet: string;
  fromCity: string;
  fromPostalCode: string;
  toStreet: string;
  toCity: string;
  toPostalCode: string;
  attributes?: number[];
  pickupTime?: string; // ISO 8601 format
}

export interface PriceQuoteResponse {
  success: boolean;
  price?: number;
  tariff?: string;
  error?: string;
  details?: string;
}

// ============================================================================
// Address Types
// ============================================================================

export interface AddressSuggestion {
  display: string;
  street: string;
  city: string;
  postalCode: string;
}

// ============================================================================
// Error Types
// ============================================================================

export type ErrorType = 'validation_error' | 'api_error' | 'server_error' | 'network_error';

export interface APIError {
  error: string;
  details: string;
  statusCode?: number;
  type?: ErrorType;
  timestamp?: string;
}

// ============================================================================
// Validation Result Types
// ============================================================================

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// ============================================================================
// Car Group Types (Vehicle Types)
// ============================================================================

export enum CarGroup {
  STANDARD = 1,    // 1-4 passengers
  LARGE = 2,       // 5-6 passengers
  MINIBUS = 3,     // 7-8 passengers
}

export interface CarGroupInfo {
  id: CarGroup;
  name: string;
  minPassengers: number;
  maxPassengers: number;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Determine the appropriate car group based on passenger count
 */
export function getCarGroupForPassengerCount(passengerCount: number): CarGroup {
  if (passengerCount <= 4) return CarGroup.STANDARD;
  if (passengerCount <= 6) return CarGroup.LARGE;
  return CarGroup.MINIBUS;
}

/**
 * Get car group information
 */
export function getCarGroupInfo(carGroup: CarGroup): CarGroupInfo {
  const carGroups: Record<CarGroup, CarGroupInfo> = {
    [CarGroup.STANDARD]: {
      id: CarGroup.STANDARD,
      name: 'Standard Taxi',
      minPassengers: 1,
      maxPassengers: 4,
    },
    [CarGroup.LARGE]: {
      id: CarGroup.LARGE,
      name: 'Large Taxi',
      minPassengers: 5,
      maxPassengers: 6,
    },
    [CarGroup.MINIBUS]: {
      id: CarGroup.MINIBUS,
      name: 'Minibus',
      minPassengers: 7,
      maxPassengers: 8,
    },
  };

  return carGroups[carGroup];
}
