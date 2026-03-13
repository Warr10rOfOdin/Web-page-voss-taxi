# Booking Status Codes Documentation

This document provides a comprehensive overview of all booking status codes used in the Voss Taxi system.

## Overview

The booking system uses two-letter or multi-letter status codes to track the lifecycle of each booking. The **last character** of each status code can be used for quick category identification, though the full code should always be used for precise status determination.

## Status Categories

### 🚫 Cancelled

| Code | Last Char | Norwegian | English | Can Delete | Receipt |
|------|-----------|-----------|---------|------------|---------|
| **A0** | `0` | Avbestilt/Sletta | Cancelled/Deleted | ❌ | ❌ |
| **CA** | `A` | Avbestilt | Cancelled | ❌ | ❌ |

### ⏳ Pending

| Code | Last Char | Norwegian | English | Can Delete | Receipt |
|------|-----------|-----------|---------|------------|---------|
| **AU** | `U` | Ventar på taxi | Awaiting Taxi | ✅ | ❌ |
| **OP** | `P` | Åpen | Open | ✅ | ❌ |
| **BUGIMN** | `N` | Under behandling | Under Review | ✅ | ❌ |
| **AUGIMN** | `N` | Ventar på behandling | Awaiting Processing | ✅ | ❌ |

### 🚕 Active

| Code | Last Char | Norwegian | English | Can Delete | Receipt |
|------|-----------|-----------|---------|------------|---------|
| **AS** | `S` | Taxi tildelt | Taxi Assigned | ❌ | ❌ |
| **AC** | `C` | Akseptert | Accepted | ❌ | ❌ |
| **EN** | `N` | På veg | En Route | ❌ | ❌ |
| **AR** | `R` | Framme | Arrived | ❌ | ❌ |
| **PU** | `U` | Passasjer om bord | Passenger On Board | ❌ | ❌ |

### ✅ Completed

| Code | Last Char | Norwegian | English | Can Delete | Receipt |
|------|-----------|-----------|---------|------------|---------|
| **CO** | `O` | Fullført | Completed | ❌ | ✅ |
| **FI** | `I` | Ferdig | Finished | ❌ | ✅ |

## Last Character Mapping

The last character provides a quick way to identify the booking category:

| Last Char | Primary Meaning | Type | Icon | Notes |
|-----------|----------------|------|------|-------|
| `0` | Cancelled/Deleted | Cancelled | ❌ | Final state |
| `A` | Cancelled | Cancelled | ❌ | Final state |
| `U` | Awaiting/Onboard | Mixed | ⏳/🚗 | Can be AU (pending) or PU (active) |
| `P` | Open | Pending | ⏳ | Waiting for assignment |
| `N` | Processing/En Route | Mixed | 🔄/🚖 | Can be BUGIMN, AUGIMN (pending) or EN (active) |
| `S` | Taxi Assigned | Active | 🚕 | Driver assigned |
| `C` | Accepted | Active | ✅ | Driver accepted |
| `R` | Arrived | Active | 📍 | At pickup location |
| `O` | Completed | Completed | ✅ | Trip finished, receipt available |
| `I` | Finished | Completed | 🏁 | Trip finished, receipt available |

## Important Notes

⚠️ **Ambiguous Last Characters**

Some last characters map to multiple codes with different meanings:

- **`U`**: Can be `AU` (Awaiting Taxi - pending) or `PU` (Passenger On Board - active)
- **`N`**: Can be `BUGIMN`/`AUGIMN` (processing - pending) or `EN` (En Route - active)

**Always use the full status code** for accurate status determination.

## Receipt Availability

📄 Receipts can only be obtained for completed trips:
- ✅ **CO** (Completed)
- ✅ **FI** (Finished)

All other statuses do not have receipts available.

## Deletion Rules

Bookings can only be deleted when:
- Status is **AU** (Awaiting Taxi)
- Status is **OP** (Open)
- Status is **BUGIMN** (Under Review)
- Status is **AUGIMN** (Awaiting Processing)
- OR: No taxi has been assigned (`vehicleNo === 0`)

Once a taxi has accepted/been assigned, the booking cannot be deleted online. Customers must contact Voss Taxi by phone for changes.

## GDPR Security

🔒 For GDPR compliance and customer privacy, the booking checker requires:
1. **Booking Reference** (e.g., BDQ558)
2. **Phone Number** (registered with the booking)

Both must match to view booking details. This prevents unauthorized access to personal travel information.

## Data Files

- **Mapping File**: `/data/booking-status-codes.json` - Complete status code database
- **Library**: `/lib/booking-status.ts` - Status lookup functions
- **API**: `/app/api/booking/details/route.ts` - Booking retrieval with verification

## Status Flow

```
OP/AU/AUGIMN/BUGIMN → AS → AC → EN → AR → PU → CO/FI
  (Pending)          (Assigned)  (Active)     (Completed)
                                              ↓
                                         📄 Receipt
                                         Available
```

## Usage Examples

### TypeScript/JavaScript

```typescript
import { getStatusInfo, getStatusByLastChar } from '@/lib/booking-status';

// Get full status info (recommended)
const status = getStatusInfo('CO');
console.log(status.label.en); // "Completed"
console.log(status.canGetReceipt); // true

// Get status by last character (quick lookup)
const quickStatus = getStatusByLastChar('CO');
console.log(quickStatus?.lastChar); // "O"
```

### API Request

```bash
# Fetch booking with GDPR verification
GET /api/booking/details?bookRef=BDQ558&phoneNumber=12345678
```

---

**Last Updated**: 2026-03-13
**Version**: 1.0
**Maintained by**: Voss Taxi Development Team
