/**
 * Validation utilities for the Voss Taxi booking system
 * Provides reusable validation functions with clear error messages
 */

import type { ValidationResult, Passenger, GeneralBookingRequest, SimpleBookingRequest } from './types/booking';

// ============================================================================
// Basic Field Validators
// ============================================================================

/**
 * Validate a required string field
 */
export function validateRequiredString(
  value: any,
  fieldName: string
): { isValid: boolean; error?: string } {
  if (!value) {
    return { isValid: false, error: `${fieldName} is required` };
  }

  if (typeof value !== 'string') {
    return { isValid: false, error: `${fieldName} must be a string` };
  }

  if (value.trim() === '') {
    return { isValid: false, error: `${fieldName} cannot be empty` };
  }

  return { isValid: true };
}

/**
 * Validate phone number (Norwegian format)
 */
export function validatePhoneNumber(phone: string): { isValid: boolean; error?: string } {
  const trimmed = phone.trim();

  // Basic validation: 8 digits, optionally starting with + or country code
  const phoneRegex = /^(\+47)?[0-9]{8}$/;

  if (!phoneRegex.test(trimmed.replace(/\s/g, ''))) {
    return {
      isValid: false,
      error: 'Phone number must be 8 digits (Norwegian format)',
    };
  }

  return { isValid: true };
}

/**
 * Validate postal code (Norwegian format)
 */
export function validatePostalCode(postalCode: string): { isValid: boolean; error?: string } {
  const trimmed = postalCode.trim();

  // Norwegian postal codes are 4 digits
  const postalCodeRegex = /^[0-9]{4}$/;

  if (!postalCodeRegex.test(trimmed)) {
    return {
      isValid: false,
      error: 'Postal code must be 4 digits',
    };
  }

  return { isValid: true };
}

/**
 * Validate ISO 8601 date string
 */
export function validateDateTime(dateTime: string): { isValid: boolean; error?: string } {
  try {
    const date = new Date(dateTime);
    if (isNaN(date.getTime())) {
      return { isValid: false, error: 'Invalid date/time format' };
    }

    // Check if date is in the past
    if (date < new Date()) {
      return { isValid: false, error: 'Pickup time cannot be in the past' };
    }

    return { isValid: true };
  } catch {
    return { isValid: false, error: 'Invalid date/time format' };
  }
}

// ============================================================================
// Passenger Validators
// ============================================================================

/**
 * Validate a single passenger
 */
export function validatePassenger(
  passenger: any,
  index: number
): ValidationResult {
  const errors: string[] = [];
  const prefix = `Passenger ${index + 1}`;

  // Validate name
  const nameValidation = validateRequiredString(passenger.clientName, 'Name');
  if (!nameValidation.isValid) {
    errors.push(`${prefix}: ${nameValidation.error}`);
  }

  // Validate phone
  const telValidation = validateRequiredString(passenger.tel, 'Phone number');
  if (!telValidation.isValid) {
    errors.push(`${prefix}: ${telValidation.error}`);
  } else {
    const phoneValidation = validatePhoneNumber(passenger.tel);
    if (!phoneValidation.isValid) {
      errors.push(`${prefix}: ${phoneValidation.error}`);
    }
  }

  // Validate pickup address
  const addressValidation = validateRequiredString(passenger.fromStreet, 'Pickup address');
  if (!addressValidation.isValid) {
    errors.push(`${prefix}: ${addressValidation.error}`);
  }

  // Validate pickup time if provided
  if (passenger.pickupTime) {
    const timeValidation = validateDateTime(passenger.pickupTime);
    if (!timeValidation.isValid) {
      errors.push(`${prefix}: ${timeValidation.error}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate array of passengers
 */
export function validatePassengers(passengers: any): ValidationResult {
  const errors: string[] = [];

  // Check if passengers is an array
  if (!Array.isArray(passengers)) {
    return {
      isValid: false,
      errors: ['Passengers must be an array'],
    };
  }

  // Check if array is not empty
  if (passengers.length === 0) {
    return {
      isValid: false,
      errors: ['At least one passenger is required'],
    };
  }

  // Validate each passenger
  passengers.forEach((passenger, index) => {
    const result = validatePassenger(passenger, index);
    errors.push(...result.errors);
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// Booking Request Validators
// ============================================================================

/**
 * Validate general booking request
 */
export function validateGeneralBookingRequest(
  request: any
): ValidationResult {
  const errors: string[] = [];

  // Validate passengers
  const passengersValidation = validatePassengers(request.passengers);
  errors.push(...passengersValidation.errors);

  // Validate pickup time
  if (request.pickupTime) {
    const timeValidation = validateDateTime(request.pickupTime);
    if (!timeValidation.isValid) {
      errors.push(timeValidation.error!);
    }
  }

  // Validate car group ID
  if (request.carGroupId && (request.carGroupId < 1 || request.carGroupId > 3)) {
    errors.push('Invalid car group ID (must be 1-3)');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate simple booking request
 */
export function validateSimpleBookingRequest(
  request: any
): ValidationResult {
  const errors: string[] = [];

  // Validate customer name
  const nameValidation = validateRequiredString(request.customerName, 'Customer name');
  if (!nameValidation.isValid) {
    errors.push(nameValidation.error!);
  }

  // Validate phone
  const telValidation = validateRequiredString(request.tel, 'Phone number');
  if (!telValidation.isValid) {
    errors.push(telValidation.error!);
  } else {
    const phoneValidation = validatePhoneNumber(request.tel);
    if (!phoneValidation.isValid) {
      errors.push(phoneValidation.error!);
    }
  }

  // Validate pickup address
  const addressValidation = validateRequiredString(request.fromStreet, 'Pickup address');
  if (!addressValidation.isValid) {
    errors.push(addressValidation.error!);
  }

  // Validate pickup time if provided
  if (request.pickupTime) {
    const timeValidation = validateDateTime(request.pickupTime);
    if (!timeValidation.isValid) {
      errors.push(timeValidation.error!);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// Sanitization Functions
// ============================================================================

/**
 * Sanitize string input (trim and limit length)
 */
export function sanitizeString(value: string, maxLength: number = 255): string {
  return value.trim().substring(0, maxLength);
}

/**
 * Sanitize phone number (remove spaces and special characters except +)
 */
export function sanitizePhoneNumber(phone: string): string {
  return phone.replace(/[^\d+]/g, '');
}

/**
 * Sanitize postal code (digits only)
 */
export function sanitizePostalCode(postalCode: string): string {
  return postalCode.replace(/\D/g, '');
}
