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
 * Validate email address
 */
export function validateEmail(email: string): { isValid: boolean; error?: string } {
  const trimmed = email.trim();

  if (trimmed === '') {
    return { isValid: true }; // Email is optional
  }

  // Basic email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(trimmed)) {
    return {
      isValid: false,
      error: 'Invalid email format',
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

    const now = new Date();
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(now.getFullYear() + 1);

    // Allow times within 5 minutes in the past (for rounding and time zone differences)
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

    if (date < fiveMinutesAgo) {
      return { isValid: false, error: 'Pickup time cannot be in the past' };
    }

    // Don't allow bookings more than 1 year in advance
    if (date > oneYearFromNow) {
      return { isValid: false, error: 'Pickup time cannot be more than 1 year in advance' };
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

  // Validate email if provided
  if (passenger.email) {
    const emailValidation = validateEmail(passenger.email);
    if (!emailValidation.isValid) {
      errors.push(`${prefix}: ${emailValidation.error}`);
    }
  }

  // Validate pickup address
  const addressValidation = validateRequiredString(passenger.fromStreet, 'Pickup address');
  if (!addressValidation.isValid) {
    errors.push(`${prefix}: ${addressValidation.error}`);
  }

  // Validate pickup city
  const cityValidation = validateRequiredString(passenger.fromCity, 'Pickup city');
  if (!cityValidation.isValid) {
    errors.push(`${prefix}: ${cityValidation.error}`);
  }

  // Validate pickup postal code
  if (passenger.fromPostalCode) {
    const postalValidation = validatePostalCode(passenger.fromPostalCode);
    if (!postalValidation.isValid) {
      errors.push(`${prefix}: ${postalValidation.error}`);
    }
  }

  // Validate destination postal code if provided
  if (passenger.toPostalCode) {
    const toPostalValidation = validatePostalCode(passenger.toPostalCode);
    if (!toPostalValidation.isValid) {
      errors.push(`${prefix}: Destination ${toPostalValidation.error}`);
    }
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
 * Validate car group ID
 */
export function validateCarGroupId(carGroupId: number): { isValid: boolean; error?: string } {
  if (typeof carGroupId !== 'number' || !Number.isInteger(carGroupId)) {
    return { isValid: false, error: 'Car group ID must be a number' };
  }

  if (carGroupId < 1 || carGroupId > 3) {
    return { isValid: false, error: 'Car group ID must be between 1 and 3' };
  }

  return { isValid: true };
}

/**
 * Validate number of cars
 */
export function validateNumberOfCars(numberOfCars: number): { isValid: boolean; error?: string } {
  if (typeof numberOfCars !== 'number' || !Number.isInteger(numberOfCars)) {
    return { isValid: false, error: 'Number of cars must be a number' };
  }

  if (numberOfCars < 1 || numberOfCars > 10) {
    return { isValid: false, error: 'Number of cars must be between 1 and 10' };
  }

  return { isValid: true };
}

/**
 * Validate passenger count
 */
export function validatePassengerCount(count: number): { isValid: boolean; error?: string } {
  if (typeof count !== 'number' || !Number.isInteger(count)) {
    return { isValid: false, error: 'Passenger count must be a number' };
  }

  if (count < 1 || count > 8) {
    return { isValid: false, error: 'Passenger count must be between 1 and 8' };
  }

  return { isValid: true };
}

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
  if (request.carGroupId) {
    const carGroupValidation = validateCarGroupId(request.carGroupId);
    if (!carGroupValidation.isValid) {
      errors.push(carGroupValidation.error!);
    }
  }

  // Validate number of cars
  if (request.numberOfCars) {
    const numberOfCarsValidation = validateNumberOfCars(request.numberOfCars);
    if (!numberOfCarsValidation.isValid) {
      errors.push(numberOfCarsValidation.error!);
    }
  }

  // Validate orderedBy if provided
  if (request.orderedBy) {
    const orderedByValidation = validateRequiredString(request.orderedBy, 'Ordered by');
    if (!orderedByValidation.isValid) {
      errors.push(orderedByValidation.error!);
    }
  }

  // Validate messageToCar length if provided
  if (request.messageToCar && request.messageToCar.length > 500) {
    errors.push('Message to car must be less than 500 characters');
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

  // Validate pickup city
  const cityValidation = validateRequiredString(request.fromCity, 'Pickup city');
  if (!cityValidation.isValid) {
    errors.push(cityValidation.error!);
  }

  // Validate pickup postal code if provided
  if (request.fromPostalCode) {
    const postalValidation = validatePostalCode(request.fromPostalCode);
    if (!postalValidation.isValid) {
      errors.push(postalValidation.error!);
    }
  }

  // Validate destination postal code if provided
  if (request.toPostalCode) {
    const toPostalValidation = validatePostalCode(request.toPostalCode);
    if (!toPostalValidation.isValid) {
      errors.push(toPostalValidation.error!);
    }
  }

  // Validate pickup time if provided
  if (request.pickupTime) {
    const timeValidation = validateDateTime(request.pickupTime);
    if (!timeValidation.isValid) {
      errors.push(timeValidation.error!);
    }
  }

  // Validate orderedBy if provided
  if (request.orderedBy) {
    const orderedByValidation = validateRequiredString(request.orderedBy, 'Ordered by');
    if (!orderedByValidation.isValid) {
      errors.push(orderedByValidation.error!);
    }
  }

  // Validate messageToCar length if provided
  if (request.messageToCar && request.messageToCar.length > 500) {
    errors.push('Message to car must be less than 500 characters');
  }

  // Validate messageToBooking length if provided
  if (request.messageToBooking && request.messageToBooking.length > 500) {
    errors.push('Message to booking must be less than 500 characters');
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
