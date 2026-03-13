# Taxi4U Status Codes Documentation

## Overview

Status codes in the Taxi4U system are **SEQUENCES** where each character represents a status change the booking has gone through. The **LAST CHARACTER** in the sequence represents the **CURRENT STATUS**.

### Example
If a booking has status `BUGIMN`:
- **B** = KREDITT (Credit payment)
- **U** = ENDRET (Changed)
- **G** = UNDER SENDING (Being sent)
- **I** = JA-SVAR (Accepted by car)
- **M** = JA-SVAR (Accepted by car again)
- **N** = KLAR FOR FAKTURERING (Ready for invoicing) ← **Current Status**

## Status Code Categories

### Payment Method Statuses
| Code | Norwegian | English | Description |
|------|-----------|---------|-------------|
| A | Kontant | Cash | Cash payment |
| B | Kreditt | Credit | Credit payment |

### Process Statuses
| Code | Norwegian | English | Description |
|------|-----------|---------|-------------|
| c | Kopiert | Copied | Booking has been copied |
| C | Sparsam | Economical | Economical/shared trip |
| D | Autobook | Autobook | Automatic booking |
| E | Fast tur | Fixed Trip | Fixed trip |
| F | Skoletur | School Trip | School trip |
| h | Hentet | Picked Up | Passenger has been picked up |
| p | Pause | Pause | Trip paused |
| x | Behandle manuelt | Handle Manually | Must be handled manually |

### Sending/Communication Statuses
| Code | Norwegian | English | Description |
|------|-----------|---------|-------------|
| G | Under sending | Being Sent | Booking is being sent to driver |
| H | Ingen kontakt | No Contact | No contact with driver |
| L | Manuelt sendt | Manually Sent | Booking has been sent manually |
| X | Forsendt | Sent Too Early | Sent too early |

### Response Statuses
| Code | Norwegian | English | Description | Show Løyve? |
|------|-----------|---------|-------------|-------------|
| **I** | **Ja-svar** | **Yes Answer** | **Car has accepted the trip** | **✅ Yes** |
| J | Nei-svar | No Answer | Car has rejected the trip | No |
| K | Timeout | Timeout | Timeout (no response) | No |
| **M** | **Ja-svar** | **Yes Answer** | **Car has accepted the trip** | **✅ Yes** |
| o | Opptatt | Busy | Car is busy | No |

### Completion Statuses
| Code | Norwegian | English | Description | Can Get Receipt? |
|------|-----------|---------|-------------|------------------|
| l | Levert | Delivered | Passenger has been delivered | ✅ Yes |
| n | Noshow | No Show | Passenger did not show up | No |
| **N** | **Klar for fakturering** | **Ready for Invoicing** | **Trip completed and ready for invoicing** | **✅ Yes** |

### Change Statuses
| Code | Norwegian | English | Description |
|------|-----------|---------|-------------|
| U | Endret | Changed | Booking has been changed |
| V | Manuelt endret | Manually Changed | Booking has been manually changed |

## Car Status Codes (vogn = 1)

These are different from booking status codes and represent the driver/car availability:

| Code | Norwegian | English | Description | Available? |
|------|-----------|---------|-------------|------------|
| 0 | Logget ut | Logged Out | Driver is logged out | No |
| 1 | Ledig | Available | Driver is available | Yes |
| 11 | Ledig korte | Available Short Trips | Driver is available for short trips | Yes |
| 12 | Ledig faste | Available Fixed Trips | Driver is available for fixed trips | Yes |
| 13 | Tur nei-svar | Trip No Answer | Driver has rejected trip | Yes |
| 14 | Tur ja-svar | Trip Yes Answer | Driver has accepted trip | No |

## Important Notes

1. **Status Sequences**: The full status string (e.g., "BUGIMN") is a history of all status changes. Always look at the LAST character to determine the current status.

2. **Løyve Display**: When the current status is **I** or **M** (car has accepted), you SHOULD display which løyve (license/car number) accepted the trip.

3. **Receipt Capability**: Receipts can only be obtained for completed trips with status **l** (Levert) or **N** (Klar for fakturering).

4. **Delete Capability**: Bookings can be deleted based on the `canDelete` property of each status code. Generally, completed or accepted trips cannot be deleted.

5. **Case Sensitivity**: Status codes are case-sensitive. `c` (Kopiert) is different from `C` (Sparsam).

## Implementation

### Getting Current Status
```typescript
import { getCurrentStatus } from '@/lib/booking-status';

const statusCode = "BUGIMN"; // Full sequence from API
const currentStatus = getCurrentStatus(statusCode); // Returns info for 'N'
console.log(currentStatus.label.no); // "Klar for fakturering"
```

### Parsing Status History
```typescript
import { parseStatusSequence } from '@/lib/booking-status';

const statusCode = "BUGIMN";
const history = parseStatusSequence(statusCode);
// Returns array of StatusInfo objects for [B, U, G, I, M, N]
history.forEach(status => {
  console.log(status.label.no); // Print each status in order
});
```

### Checking Capabilities
```typescript
const currentStatus = getCurrentStatus(booking.tripStatus);

if (currentStatus.canGetReceipt) {
  // Show receipt download button
}

if (currentStatus.canDelete) {
  // Show delete button
}

if (currentStatus.showLoyve && booking.licenseNo) {
  // Display: "🚕 Løyve: {booking.licenseNo}"
}
```

## Data Source

This status code mapping is based on the official Excel spreadsheet from the Taxi4U system (sentralkode = VS, vogn = 0 for booking statuses, vogn = 1 for car statuses).

Last updated: 2026-03-13
