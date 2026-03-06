export interface LatLng {
  lat: number;
  lng: number;
}

export interface Waypoint {
  id: string;
  position: LatLng;
  reached: boolean;
  iconIndex: number;
}

export interface GameSettings {
  radiusMeters: number;
  waypointCount: number;
}

export interface GameSession {
  id: number;
  waypointCount: number;
  radiusMeters: number;
  distanceWalkedMeters: number;
  elapsedTimeSeconds: number;
  completed: boolean;
}

export type GamePhase = 'idle' | 'configuring' | 'generating' | 'playing' | 'won';

export interface OverpassElement {
  type: string;
  id: number;
  geometry: Array<{ lat: number; lon: number }>;
  tags?: Record<string, string>;
}

export interface OverpassResponse {
  elements: OverpassElement[];
}
