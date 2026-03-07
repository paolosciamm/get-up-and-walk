import { Circle } from 'react-leaflet';
import type { LatLng } from '../../types/game';

interface RadiusCircleProps {
  center: LatLng;
  radius: number;
  theme: 'dark' | 'light';
}

const COLORS = {
  dark: '#ffd93d',
  light: '#1a73e8',
};

export default function RadiusCircle({ center, radius, theme }: RadiusCircleProps) {
  const color = COLORS[theme];

  return (
    <Circle
      center={[center.lat, center.lng]}
      radius={radius}
      pathOptions={{
        color,
        fillColor: color,
        fillOpacity: 0.05,
        weight: 2,
        dashArray: '8 6',
      }}
    />
  );
}
