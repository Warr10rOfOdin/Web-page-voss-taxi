/**
 * Zone mapping for Voss area
 * Maps postal codes to zone numbers
 */

interface Zone {
  postalCode: string;
  city: string;
  zoneNo: number;
}

// Default zones for Voss area (will be populated from API)
const vossZones: Zone[] = [
  { postalCode: '5700', city: 'VOSS', zoneNo: 1 }, // Central Voss
  { postalCode: '5704', city: 'VOSS', zoneNo: 1 },
  { postalCode: '5706', city: 'VOSS', zoneNo: 1 },
  { postalCode: '5710', city: 'SKULESTADMO', zoneNo: 2 },
  { postalCode: '5715', city: 'VOSSESTRAND', zoneNo: 3 },
];

/**
 * Get zone number from postal code
 */
export function getZoneFromPostalCode(postalCode: string): number {
  const zone = vossZones.find(z => z.postalCode === postalCode);
  return zone ? zone.zoneNo : 1; // Default to zone 1 (central Voss)
}

/**
 * Get zone number from city name
 */
export function getZoneFromCity(city: string): number {
  const normalizedCity = city.toUpperCase().trim();
  const zone = vossZones.find(z => z.city === normalizedCity);
  return zone ? zone.zoneNo : 1; // Default to zone 1
}

/**
 * Get zone number (tries postal code first, then city)
 */
export function getZoneNumber(postalCode?: string, city?: string): number {
  if (postalCode) {
    const zoneFromPostal = getZoneFromPostalCode(postalCode);
    if (zoneFromPostal) return zoneFromPostal;
  }

  if (city) {
    const zoneFromCity = getZoneFromCity(city);
    if (zoneFromCity) return zoneFromCity;
  }

  // Default to zone 1 (central Voss)
  return 1;
}
