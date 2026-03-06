import { CircleMarker, Circle } from 'react-leaflet';
import type { LatLng } from '../../types/game';

interface UserPositionMarkerProps {
  position: LatLng;
  accuracy: number | null;
}

export default function UserPositionMarker({ position, accuracy }: UserPositionMarkerProps) {
  return (
    <>
      {/* Accuracy circle */}
      {accuracy && accuracy < 100 && (
        <Circle
          center={[position.lat, position.lng]}
          radius={accuracy}
          pathOptions={{
            color: '#4a9eff',
            fillColor: '#4a9eff',
            fillOpacity: 0.08,
            weight: 1,
            dashArray: '4 4',
          }}
        />
      )}
      {/* Pulsing outer ring */}
      <CircleMarker
        center={[position.lat, position.lng]}
        radius={16}
        pathOptions={{
          color: '#4a9eff',
          fillColor: '#4a9eff',
          fillOpacity: 0.15,
          weight: 0,
        }}
      />
      {/* Inner dot */}
      <CircleMarker
        center={[position.lat, position.lng]}
        radius={7}
        pathOptions={{
          color: '#fff',
          fillColor: '#4a9eff',
          fillOpacity: 1,
          weight: 3,
        }}
      />
    </>
  );
}
