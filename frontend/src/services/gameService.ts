import api from './api';
import type { GameSession } from '../types/game';

export async function createSession(waypointCount: number, radiusMeters: number): Promise<GameSession> {
  const { data } = await api.post<GameSession>('/api/game/sessions', { waypointCount, radiusMeters });
  return data;
}

export async function updateSession(
  id: number,
  distanceWalkedMeters: number,
  elapsedTimeSeconds: number,
  completed: boolean
): Promise<GameSession> {
  const { data } = await api.put<GameSession>(`/api/game/sessions/${id}`, {
    distanceWalkedMeters,
    elapsedTimeSeconds,
    completed,
  });
  return data;
}

export async function getSessions(): Promise<GameSession[]> {
  const { data } = await api.get<GameSession[]>('/api/game/sessions');
  return data;
}
