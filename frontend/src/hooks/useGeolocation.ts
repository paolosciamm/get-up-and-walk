import { useState, useEffect, useRef, useCallback } from 'react';
import type { LatLng } from '../types/game';

interface GeolocationState {
  position: LatLng | null;
  accuracy: number | null;
  error: string | null;
  errorCode: number | null;
  loading: boolean;
  retry: () => void;
}

export function useGeolocation(enabled: boolean = true): GeolocationState {
  const [state, setState] = useState<{
    position: LatLng | null;
    accuracy: number | null;
    error: string | null;
    errorCode: number | null;
    loading: boolean;
  }>({
    position: null,
    accuracy: null,
    error: null,
    errorCode: null,
    loading: true,
  });
  const watchIdRef = useRef<number | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const startWatch = useCallback(() => {
    if (!navigator.geolocation) {
      setState((s) => ({ ...s, error: 'Geolocation is not supported by your browser', errorCode: null, loading: false }));
      return;
    }

    // Clear previous watch
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }

    setState((s) => ({ ...s, loading: true, error: null, errorCode: null }));

    const onSuccess = (pos: GeolocationPosition) => {
      setState({
        position: { lat: pos.coords.latitude, lng: pos.coords.longitude },
        accuracy: pos.coords.accuracy,
        error: null,
        errorCode: null,
        loading: false,
      });
    };

    const onError = (err: GeolocationPositionError) => {
      setState((s) => ({ ...s, error: err.message, errorCode: err.code, loading: false }));
    };

    // First try getCurrentPosition (faster initial fix), then watchPosition
    navigator.geolocation.getCurrentPosition(
      onSuccess,
      () => {
        // getCurrentPosition failed, try watchPosition with relaxed settings
        watchIdRef.current = navigator.geolocation.watchPosition(onSuccess, onError, {
          enableHighAccuracy: false,
          maximumAge: 60000,
          timeout: 30000,
        });
      },
      {
        enableHighAccuracy: true,
        maximumAge: 30000,
        timeout: 15000,
      }
    );

    // Also start watchPosition for continuous updates
    watchIdRef.current = navigator.geolocation.watchPosition(onSuccess, onError, {
      enableHighAccuracy: true,
      maximumAge: 5000,
      timeout: 30000,
    });
  }, []);

  useEffect(() => {
    if (!enabled) return;
    startWatch();

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [enabled, retryCount, startWatch]);

  const retry = useCallback(() => {
    setRetryCount((c) => c + 1);
  }, []);

  return { ...state, retry };
}
