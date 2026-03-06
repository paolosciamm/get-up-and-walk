import type { OverpassResponse } from '../types/game';

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

export async function fetchWalkableWays(
  lat: number,
  lon: number,
  radiusMeters: number
): Promise<OverpassResponse> {
  const query = `
    [out:json][timeout:15];
    (
      way(around:${radiusMeters},${lat},${lon})
        ["highway"~"^(footway|path|pedestrian|residential|living_street|track|tertiary|secondary|unclassified|cycleway|service)$"]
        ["access"!~"^(private|no)$"];
    );
    out geom;
  `;

  const response = await fetch(OVERPASS_URL, {
    method: 'POST',
    body: `data=${encodeURIComponent(query)}`,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  if (!response.ok) {
    throw new Error(`Overpass API error: ${response.status}`);
  }

  return response.json();
}
