import { useState, useCallback } from 'react';
import type { LatLng, Waypoint } from '../types/game';
import { fetchWalkableWays } from '../services/overpassService';
import { sampleWaypoints } from '../utils/waypointSampler';

export function useWaypointGenerator() {
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (center: LatLng, radiusMeters: number, count: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchWalkableWays(center.lat, center.lng, radiusMeters);
      if (!response.elements || response.elements.length === 0) {
        throw new Error('No walkable paths found in this area. Try increasing the radius.');
      }

      const positions = sampleWaypoints(response.elements, count);
      const newWaypoints: Waypoint[] = positions.map((pos, i) => ({
        id: `wp-${Date.now()}-${i}`,
        position: pos,
        reached: false,
        iconIndex: i % 5,
      }));

      setWaypoints(newWaypoints);
      return newWaypoints;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to generate waypoints';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const markReached = useCallback((waypointId: string) => {
    setWaypoints((prev) =>
      prev.map((wp) => (wp.id === waypointId ? { ...wp, reached: true } : wp))
    );
  }, []);

  const reset = useCallback(() => {
    setWaypoints([]);
    setError(null);
  }, []);

  return { waypoints, loading, error, generate, markReached, reset };
}
