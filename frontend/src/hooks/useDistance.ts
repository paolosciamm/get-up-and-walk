import { useRef, useCallback, useState } from 'react';
import type { LatLng } from '../types/game';
import { haversineDistance } from '../utils/geo';

export function useDistance() {
  const [distance, setDistance] = useState(0);
  const prevPositionRef = useRef<LatLng | null>(null);

  const updatePosition = useCallback((position: LatLng, accuracy: number | null) => {
    // Ignore inaccurate readings
    if (accuracy && accuracy > 30) return;

    if (prevPositionRef.current) {
      const delta = haversineDistance(prevPositionRef.current, position);
      // Filter noise: ignore < 1m (GPS jitter) and > 50m (GPS jump)
      if (delta >= 1 && delta <= 50) {
        setDistance((prev) => prev + delta);
      }
    }
    prevPositionRef.current = position;
  }, []);

  const reset = useCallback(() => {
    setDistance(0);
    prevPositionRef.current = null;
  }, []);

  return { distance, updatePosition, reset };
}
