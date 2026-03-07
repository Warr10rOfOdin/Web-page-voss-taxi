/**
 * Zone mapping for Voss Taxi area
 * Maps postal codes and cities to official Taxi4U zone numbers (100-903)
 *
 * Zone structure based on official zone maps:
 * - Zone 100: Central Vossevangen
 * - Zone 200-304: Nearby suburbs and villages
 * - Zone 400-504: Outer areas
 * - Zone 600-703: Further regions (Raundalen, etc.)
 * - Zone 800-903: Remote areas
 */

interface Zone {
  postalCode: string;
  city: string;
  zoneNo: number;
}

// Official zone mappings for Voss area
// Note: These are the actual zone codes expected by Taxi4U API (100-903 range)
const vossZones: Zone[] = [
  // Zone 100 - Central Vossevangen
  { postalCode: '5700', city: 'VOSSEVANGEN', zoneNo: 100 },
  { postalCode: '5700', city: 'VOSS', zoneNo: 100 },
  { postalCode: '5704', city: 'VOSS', zoneNo: 100 },

  // Zone 200 - Nearby areas
  { postalCode: '5706', city: 'VOSS', zoneNo: 200 },

  // Zone 300 - Suburbs
  { postalCode: '5710', city: 'SKULESTADMO', zoneNo: 500 },

  // Zone 700 - Raundalen and surrounding
  { postalCode: '5715', city: 'VOSSESTRAND', zoneNo: 700 },

  // Add more mappings as needed based on actual usage
];

/**
 * Get zone number from postal code
 */
export function getZoneFromPostalCode(postalCode: string): number {
  if (!postalCode) return 100;

  const zone = vossZones.find(z => z.postalCode === postalCode);
  return zone ? zone.zoneNo : 100; // Default to zone 100 (central Voss)
}

/**
 * Get zone number from city name
 */
export function getZoneFromCity(city: string): number {
  if (!city) return 100;

  const normalizedCity = city.toUpperCase().trim();
  const zone = vossZones.find(z => z.city === normalizedCity);
  return zone ? zone.zoneNo : 100; // Default to zone 100
}

/**
 * Get zone number - returns a default zone since postal codes don't correlate to zones
 * The API requires a zone number but doesn't use it for address-based routing
 * Returns 1 as the default/universal zone number (zone 0 is invalid)
 */
export function getZoneNumber(postalCode?: string, city?: string): number {
  // API requires zone number but postal codes don't correlate to zones
  // Use zone 1 as default (zone 0 is treated as "missing" by API)
  // API should route based on complete address instead
  return 1;
}
