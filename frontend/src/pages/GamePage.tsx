import { useState, useEffect, useCallback, useRef } from 'react';
import type { GamePhase } from '../types/game';
import { useGeolocation } from '../hooks/useGeolocation';
import { useTimer } from '../hooks/useTimer';
import { useDistance } from '../hooks/useDistance';
import { useWaypointGenerator } from '../hooks/useWaypointGenerator';
import { haversineDistance } from '../utils/geo';
import { createSession, updateSession } from '../services/gameService';
import Header from '../components/layout/Header';
import GameMap from '../components/map/GameMap';
import GameHUD from '../components/game/GameHUD';
import GameSettings from '../components/game/GameSettings';
import GameControls from '../components/game/GameControls';
import VictoryModal from '../components/game/VictoryModal';
import LoadingSpinner from '../components/common/LoadingSpinner';

const REACH_DISTANCE = 5; // meters

export default function GamePage() {
  const [phase, setPhase] = useState<GamePhase>('idle');
  const [radiusMeters, setRadiusMeters] = useState(500);
  const [waypointCount, setWaypointCount] = useState(5);
  const [generated, setGenerated] = useState(false);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { position, accuracy, error: geoError, errorCode: geoErrorCode, loading: geoLoading, retry: retryGeo, setManualPosition } = useGeolocation();
  const { elapsed, reset: resetTimer } = useTimer(phase === 'playing');
  const { distance, updatePosition, reset: resetDistance } = useDistance();
  const { waypoints, loading: genLoading, error: genError, generate, markReached, reset: resetWaypoints } = useWaypointGenerator();

  const reachedCount = waypoints.filter((wp) => wp.reached).length;
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  // Update distance tracking when position changes and game is playing
  useEffect(() => {
    if (phase === 'playing' && position) {
      updatePosition(position, accuracy);
    }
  }, [phase, position, accuracy, updatePosition]);

  // Proximity check for waypoints
  useEffect(() => {
    if (phase !== 'playing' || !position) return;

    for (const wp of waypoints) {
      if (!wp.reached) {
        const dist = haversineDistance(position, wp.position);
        if (dist <= REACH_DISTANCE) {
          markReached(wp.id);
        }
      }
    }
  }, [phase, position, waypoints, markReached]);

  // Check win condition
  useEffect(() => {
    if (phase === 'playing' && waypoints.length > 0 && reachedCount === waypoints.length) {
      setPhase('won');
      // Save to backend
      if (sessionId) {
        updateSession(sessionId, distance, elapsed, true).catch(console.error);
      }
    }
  }, [phase, reachedCount, waypoints.length, sessionId, distance, elapsed]);

  // Wake lock management
  useEffect(() => {
    if (phase === 'playing' && 'wakeLock' in navigator) {
      navigator.wakeLock.request('screen')
        .then((lock) => { wakeLockRef.current = lock; })
        .catch(() => {});
    }
    return () => {
      wakeLockRef.current?.release().catch(() => {});
      wakeLockRef.current = null;
    };
  }, [phase]);

  const handleNewGame = () => {
    setPhase('configuring');
    setGenerated(false);
    setError(null);
  };

  const handleGenerate = useCallback(async () => {
    if (!position) return;
    setError(null);
    try {
      await generate(position, radiusMeters, waypointCount);
      setGenerated(true);
    } catch {
      // Error already set in hook
    }
  }, [position, radiusMeters, waypointCount, generate]);

  const handleStart = useCallback(async () => {
    if (waypoints.length === 0) return;
    try {
      const session = await createSession(waypointCount, radiusMeters);
      setSessionId(session.id);
    } catch {
      // Continue without backend session
    }
    resetTimer();
    resetDistance();
    setPhase('playing');
  }, [waypoints.length, waypointCount, radiusMeters, resetTimer, resetDistance]);

  const handleStop = () => {
    setPhase('idle');
    resetWaypoints();
    resetTimer();
    resetDistance();
    setSessionId(null);
  };

  const handlePlayAgain = () => {
    resetWaypoints();
    resetTimer();
    resetDistance();
    setSessionId(null);
    setGenerated(false);
    setPhase('configuring');
  };

  if (geoLoading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary)',
      }}>
        <LoadingSpinner message="Acquiring GPS position..." />
      </div>
    );
  }

  if (geoError) {
    const isMac = navigator.platform.toUpperCase().includes('MAC');
    const isPermissionDenied = geoErrorCode === 1;
    const isPositionUnavailable = geoErrorCode === 2;

    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary)',
        padding: '20px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>📍</div>
        <h2 style={{ color: 'var(--text-primary)', marginBottom: '12px' }}>GPS Required</h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '440px', lineHeight: 1.7, marginBottom: '20px' }}>
          {geoError}
        </p>

        <div style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--border)',
          padding: '20px 24px',
          maxWidth: '440px',
          textAlign: 'left',
          marginBottom: '24px',
        }}>
          <p style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '10px', fontSize: '0.9rem' }}>
            How to fix:
          </p>
          <ol style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.8, paddingLeft: '20px' }}>
            {isMac && (
              <>
                <li>Open <strong>System Settings &gt; Privacy &amp; Security &gt; Location Services</strong></li>
                <li>Make sure Location Services is <strong>ON</strong></li>
                <li>Find your browser in the list and enable it</li>
              </>
            )}
            {isPermissionDenied && (
              <li>Click the <strong>lock icon</strong> in the address bar and allow location access</li>
            )}
            {isPositionUnavailable && !isMac && (
              <>
                <li>Make sure your device has GPS or Wi-Fi enabled</li>
                <li>If on desktop, ensure Location Services is enabled in your OS settings</li>
              </>
            )}
            <li>Make sure you are using <strong>HTTPS</strong> (https://localhost:5173)</li>
            <li>Reload the page after enabling location</li>
          </ol>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={retryGeo}
            style={{
              padding: '12px 32px',
              borderRadius: 'var(--radius)',
              border: 'none',
              background: 'var(--accent)',
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.95rem',
              cursor: 'pointer',
            }}
          >
            Retry
          </button>
          <button
            onClick={() => {
              // Default: Cosenza, Italy (UNICAL area)
              setManualPosition({ lat: 39.3566, lng: 16.2273 });
            }}
            style={{
              padding: '12px 32px',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--border)',
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              fontWeight: 600,
              fontSize: '0.95rem',
              cursor: 'pointer',
            }}
          >
            Use Demo Position
          </button>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '12px' }}>
          Demo position uses Cosenza, Italy. On mobile with GPS, your real position will be used.
        </p>
      </div>
    );
  }

  if (!position) return null;

  return (
    <div style={{ height: '100vh', width: '100vw', position: 'relative', overflow: 'hidden' }}>
      <Header />

      <GameMap
        center={position}
        userPosition={position}
        accuracy={accuracy}
        waypoints={waypoints}
        radiusMeters={radiusMeters}
        showRadius={phase === 'configuring'}
      />

      {phase === 'playing' && (
        <GameHUD
          elapsed={elapsed}
          distance={distance}
          reached={reachedCount}
          total={waypoints.length}
        />
      )}

      {phase === 'configuring' && !generated && (
        <GameSettings
          radiusMeters={radiusMeters}
          waypointCount={waypointCount}
          onRadiusChange={setRadiusMeters}
          onWaypointCountChange={setWaypointCount}
          onGenerate={handleGenerate}
          loading={genLoading}
        />
      )}

      {(error || genError) && (
        <div style={{
          position: 'absolute',
          top: '70px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(244,67,54,0.15)',
          border: '1px solid rgba(244,67,54,0.3)',
          borderRadius: 'var(--radius)',
          padding: '10px 20px',
          zIndex: 1000,
          color: 'var(--danger)',
          fontSize: '0.85rem',
          maxWidth: 'calc(100% - 40px)',
          textAlign: 'center',
        }}>
          {error || genError}
        </div>
      )}

      <GameControls
        phase={phase}
        onNewGame={handleNewGame}
        onStart={handleStart}
        onStop={handleStop}
        onPlayAgain={handlePlayAgain}
      />

      {phase === 'won' && (
        <VictoryModal
          elapsed={elapsed}
          distance={distance}
          waypointCount={waypoints.length}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </div>
  );
}
