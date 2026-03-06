import type { LatLng, OverpassElement } from '../types/game';
import { haversineDistance, interpolate } from './geo';

interface Segment {
  start: LatLng;
  end: LatLng;
  length: number;
}

export function sampleWaypoints(
  elements: OverpassElement[],
  count: number,
  minSeparation: number = 30
): LatLng[] {
  const segments: Segment[] = [];
  let totalLen = 0;

  for (const el of elements) {
    if (!el.geometry || el.geometry.length < 2) continue;
    for (let i = 1; i < el.geometry.length; i++) {
      const start: LatLng = { lat: el.geometry[i - 1].lat, lng: el.geometry[i - 1].lon };
      const end: LatLng = { lat: el.geometry[i].lat, lng: el.geometry[i].lon };
      const length = haversineDistance(start, end);
      if (length > 0.5) {
        segments.push({ start, end, length });
        totalLen += length;
      }
    }
  }

  if (segments.length === 0 || totalLen < 10) {
    throw new Error('Not enough walkable paths found. Try increasing the radius.');
  }

  const cumulativeLengths: number[] = [];
  let cumLen = 0;
  for (const seg of segments) {
    cumLen += seg.length;
    cumulativeLengths.push(cumLen);
  }

  const waypoints: LatLng[] = [];
  const maxAttempts = count * 50;
  let attempts = 0;
  let currentMinSep = minSeparation;

  while (waypoints.length < count && attempts < maxAttempts) {
    attempts++;

    const randomDist = Math.random() * totalLen;
    const segIdx = cumulativeLengths.findIndex((cl) => cl >= randomDist);
    if (segIdx === -1) continue;

    const seg = segments[segIdx];
    const prevCum = segIdx > 0 ? cumulativeLengths[segIdx - 1] : 0;
    const fraction = (randomDist - prevCum) / seg.length;
    const candidate = interpolate(seg.start, seg.end, Math.max(0, Math.min(1, fraction)));

    const tooClose = waypoints.some((wp) => haversineDistance(wp, candidate) < currentMinSep);
    if (!tooClose) {
      waypoints.push(candidate);
    }

    // Gradually relax separation if struggling to place points
    if (attempts > 0 && attempts % (count * 10) === 0 && waypoints.length < count) {
      currentMinSep = Math.max(5, currentMinSep * 0.7);
    }
  }

  if (waypoints.length === 0) {
    throw new Error('Could not generate any waypoints. Try increasing the radius.');
  }

  return waypoints;
}
