import { CircleMarker, Circle } from 'react-leaflet';
import type { LatLng } from '../../types/game';

interface UserPositionMarkerProps {
  position: LatLng;
  accuracy: number | null;
  theme: 'dark' | 'light';
}

const COLORS = {
  dark: { main: '#ffd93d', border: '#fff' },
  light: { main: '#1a73e8', border: '#fff' },
};

export default function UserPositionMarker({ position, accuracy, theme }: UserPositionMarkerProps) {
  const c = COLORS[theme];

  return (
    <>
      {accuracy && accuracy < 100 && (
        <Circle
          center={[position.lat, position.lng]}
          radius={accuracy}
          pathOptions={{
            color: c.main,
            fillColor: c.main,
            fillOpacity: 0.08,
            weight: 1,
            dashArray: '4 4',
          }}
        />
      )}
      <CircleMarker
        center={[position.lat, position.lng]}
        radius={16}
        pathOptions={{
          color: c.main,
          fillColor: c.main,
          fillOpacity: 0.15,
          weight: 0,
        }}
      />
      <CircleMarker
        center={[position.lat, position.lng]}
        radius={7}
        pathOptions={{
          color: c.border,
          fillColor: c.main,
          fillOpacity: 1,
          weight: 3,
        }}
      />
    </>
  );
}
