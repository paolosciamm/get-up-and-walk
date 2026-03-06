import { Circle } from 'react-leaflet';
import type { LatLng } from '../../types/game';

interface RadiusCircleProps {
  center: LatLng;
  radius: number;
}

export default function RadiusCircle({ center, radius }: RadiusCircleProps) {
  return (
    <Circle
      center={[center.lat, center.lng]}
      radius={radius}
      pathOptions={{
        color: '#4a9eff',
        fillColor: '#4a9eff',
        fillOpacity: 0.05,
        weight: 2,
        dashArray: '8 6',
      }}
    />
  );
}
