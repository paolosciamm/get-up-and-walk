import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { useEffect, useState } from 'react';
import type { LatLng, Waypoint } from '../../types/game';
import WaypointMarker from './WaypointMarker';
import UserPositionMarker from './UserPositionMarker';
import RadiusCircle from './RadiusCircle';

const TILE_LAYERS = {
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
  },
  light: {
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
  },
} as const;

type MapTheme = keyof typeof TILE_LAYERS;

interface GameMapProps {
  center: LatLng;
  userPosition: LatLng | null;
  accuracy: number | null;
  waypoints: Waypoint[];
  radiusMeters: number;
  showRadius: boolean;
}

function RecenterMap({ position }: { position: LatLng }) {
  const map = useMap();
  useEffect(() => {
    map.setView([position.lat, position.lng], map.getZoom(), { animate: true });
  }, [map, position.lat, position.lng]);
  return null;
}

export default function GameMap({
  center,
  userPosition,
  accuracy,
  waypoints,
  radiusMeters,
  showRadius,
}: GameMapProps) {
  const [theme, setTheme] = useState<MapTheme>(() => {
    return (localStorage.getItem('mapTheme') as MapTheme) || 'dark';
  });

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('mapTheme', next);
  };

  const tile = TILE_LAYERS[theme];

  return (
    <>
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={16}
        style={{ width: '100%', height: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          key={theme}
          attribution={tile.attribution}
          url={tile.url}
        />

        {userPosition && <RecenterMap position={userPosition} />}

        {userPosition && (
          <UserPositionMarker position={userPosition} accuracy={accuracy} theme={theme} />
        )}

        {showRadius && userPosition && (
          <RadiusCircle center={userPosition} radius={radiusMeters} theme={theme} />
        )}

        {waypoints.map((wp, i) => (
          <WaypointMarker key={wp.id} waypoint={wp} index={i} />
        ))}
      </MapContainer>

      {/* Theme toggle button */}
      <button
        onClick={toggleTheme}
        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} map`}
        style={{
          position: 'absolute',
          top: '64px',
          right: '10px',
          zIndex: 1000,
          width: '36px',
          height: '36px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border)',
          background: 'var(--bg-card)',
          color: 'var(--text-primary)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px',
          boxShadow: 'var(--shadow)',
          transition: 'background var(--transition)',
        }}
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
    </>
  );
}
