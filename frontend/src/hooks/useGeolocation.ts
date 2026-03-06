import { useState, useEffect, useRef } from 'react';
import type { LatLng } from '../types/game';

interface GeolocationState {
  position: LatLng | null;
  accuracy: number | null;
  error: string | null;
  loading: boolean;
}

export function useGeolocation(enabled: boolean = true): GeolocationState {
  const [state, setState] = useState<GeolocationState>({
    position: null,
    accuracy: null,
    error: null,
    loading: true,
  });
  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;

    if (!navigator.geolocation) {
      setState((s) => ({ ...s, error: 'Geolocation is not supported by your browser', loading: false }));
      return;
    }

    const onSuccess = (pos: GeolocationPosition) => {
      setState({
        position: { lat: pos.coords.latitude, lng: pos.coords.longitude },
        accuracy: pos.coords.accuracy,
        error: null,
        loading: false,
      });
    };

    const onError = (err: GeolocationPositionError) => {
      let msg = 'Location error';
      if (err.code === 1) msg = 'Location permission denied. Please enable GPS access.';
      else if (err.code === 2) msg = 'Position unavailable. Please try again.';
      else if (err.code === 3) msg = 'Location request timed out.';
      setState((s) => ({ ...s, error: msg, loading: false }));
    };

    watchIdRef.current = navigator.geolocation.watchPosition(onSuccess, onError, {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 15000,
    });

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [enabled]);

  return state;
}
