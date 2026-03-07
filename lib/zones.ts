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
 * Get zone number - returns zone 100 (central Voss)
 * Since postal codes don't correlate to zones, use the standard Voss zone
 * Zone 100 is the default zone for the Voss central area
 */
export function getZoneNumber(postalCode?: string, city?: string): number {
  // Zones 0 and 1 are invalid/missing
  // Use zone 100 (central Voss zone from zone mapping)
  return 100;
}
