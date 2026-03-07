import zonesData from './zones_data.json';

interface ZoneVertex {
  lon: number;
  lat: number;
}

interface Zone {
  name: string;
  number: number;
  type: number;
  vertices: number[][];
}

/**
 * Point-in-polygon algorithm using ray casting
 * @param point [lon, lat] coordinates
 * @param polygon Array of [lon, lat] vertices
 * @returns true if point is inside polygon
 */
function isPointInPolygon(point: [number, number], polygon: number[][]): boolean {
  const [x, y] = point;
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];

    const intersect = ((yi > y) !== (yj > y)) &&
      (x < (xj - xi) * (y - yi) / (yj - yi) + xi);

    if (intersect) inside = !inside;
  }

  return inside;
}

/**
 * Find which zone a GPS coordinate is in
 * @param lon Longitude
 * @param lat Latitude
 * @returns Zone number or -2 (Unknown) if not found
 */
export function getZoneFromCoordinates(lon: number, lat: number): number {
  // Check each zone's polygon
  for (const zone of zonesData as Zone[]) {
    if (zone.vertices.length < 3) continue; // Need at least 3 points for a polygon

    if (isPointInPolygon([lon, lat], zone.vertices)) {
      return zone.number;
    }
  }

  // Not found in any zone - return -2 (Unknown)
  return -2;
}

/**
 * Get zone name by zone number
 */
export function getZoneName(zoneNumber: number): string {
  const zone = (zonesData as Zone[]).find(z => z.number === zoneNumber);
  return zone ? zone.name : '<Ukjent>';
}

/**
 * Get all zones
 */
export function getAllZones(): Zone[] {
  return zonesData as Zone[];
}
