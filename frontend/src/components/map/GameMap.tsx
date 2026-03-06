import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import type { LatLng, Waypoint } from '../../types/game';
import WaypointMarker from './WaypointMarker';
import UserPositionMarker from './UserPositionMarker';
import RadiusCircle from './RadiusCircle';

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
  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={16}
      style={{ width: '100%', height: '100%' }}
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />

      {userPosition && <RecenterMap position={userPosition} />}

      {userPosition && (
        <UserPositionMarker position={userPosition} accuracy={accuracy} />
      )}

      {showRadius && userPosition && (
        <RadiusCircle center={userPosition} radius={radiusMeters} />
      )}

      {waypoints.map((wp, i) => (
        <WaypointMarker key={wp.id} waypoint={wp} index={i} />
      ))}
    </MapContainer>
  );
}
