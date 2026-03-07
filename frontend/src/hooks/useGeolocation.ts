import { useState, useEffect, useRef, useCallback } from 'react';
import type { LatLng } from '../types/game';

interface GeolocationState {
  position: LatLng | null;
  accuracy: number | null;
  error: string | null;
  errorCode: number | null;
  loading: boolean;
  retry: () => void;
  setManualPosition: (pos: LatLng) => void;
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
  const timeoutRef = useRef<number | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const startWatch = useCallback(() => {
    if (!navigator.geolocation) {
      setState((s) => ({ ...s, error: 'Geolocation is not supported by your browser', errorCode: null, loading: false }));
      return;
    }

    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
    }

    setState((s) => ({ ...s, loading: true, error: null, errorCode: null }));

    const onSuccess = (pos: GeolocationPosition) => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setState({
        position: { lat: pos.coords.latitude, lng: pos.coords.longitude },
        accuracy: pos.coords.accuracy,
        error: null,
        errorCode: null,
        loading: false,
      });
    };

    const onError = (err: GeolocationPositionError) => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setState((s) => ({ ...s, error: err.message, errorCode: err.code, loading: false }));
    };

    // Safety timeout: if nothing happens in 10 seconds, stop loading
    timeoutRef.current = window.setTimeout(() => {
      setState((s) => {
        if (s.loading) {
          return { ...s, error: 'GPS timed out. Your device may not support geolocation, or location services are disabled.', errorCode: 3, loading: false };
        }
        return s;
      });
    }, 10000);

    navigator.geolocation.getCurrentPosition(onSuccess, onError, {
      enableHighAccuracy: false,
      maximumAge: 60000,
      timeout: 8000,
    });

    watchIdRef.current = navigator.geolocation.watchPosition(onSuccess, onError, {
      enableHighAccuracy: true,
      maximumAge: 5000,
      timeout: 15000,
    });
  }, []);

  useEffect(() => {
    if (!enabled) return;
    startWatch();

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [enabled, retryCount, startWatch]);

  const retry = useCallback(() => {
    setRetryCount((c) => c + 1);
  }, []);

  const setManualPosition = useCallback((pos: LatLng) => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setState({
      position: pos,
      accuracy: 10,
      error: null,
      errorCode: null,
      loading: false,
    });
  }, []);

  return { ...state, retry, setManualPosition };
}
