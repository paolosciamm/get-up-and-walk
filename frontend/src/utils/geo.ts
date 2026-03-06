import type { LatLng } from '../types/game';

const R = 6371000; // Earth radius in meters

export function haversineDistance(a: LatLng, b: LatLng): number {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);
  const h = sinDLat * sinDLat + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinDLng * sinDLng;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function interpolate(a: LatLng, b: LatLng, fraction: number): LatLng {
  return {
    lat: a.lat + (b.lat - a.lat) * fraction,
    lng: a.lng + (b.lng - a.lng) * fraction,
  };
}

export function totalLength(points: LatLng[]): number {
  let length = 0;
  for (let i = 1; i < points.length; i++) {
    length += haversineDistance(points[i - 1], points[i]);
  }
  return length;
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}
