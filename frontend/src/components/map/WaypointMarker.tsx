import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { Waypoint } from '../../types/game';

const CANDY_SVGS = [
  // Lollipop (red)
  `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="44" viewBox="0 0 36 44"><circle cx="18" cy="14" r="12" fill="%23ff6b6b" stroke="%23fff" stroke-width="2"/><circle cx="18" cy="14" r="7" fill="%23ff8e8e"/><circle cx="15" cy="11" r="2" fill="%23ffb3b3"/><rect x="16" y="26" width="4" height="16" rx="2" fill="%23deb887"/></svg>`,
  // Cupcake (blue)
  `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="44" viewBox="0 0 36 44"><path d="M6 24h24l-3 18H9z" fill="%23deb887" stroke="%23c4a067" stroke-width="1"/><ellipse cx="18" cy="24" rx="14" ry="8" fill="%234a9eff"/><ellipse cx="18" cy="22" rx="12" ry="6" fill="%236bb3ff"/><circle cx="14" cy="20" r="2" fill="%23ff6b9d"/><circle cx="22" cy="20" r="2" fill="%23ffd93d"/><circle cx="18" cy="18" r="2" fill="%234caf50"/><circle cx="18" cy="14" r="3" fill="%23ff6b6b"/></svg>`,
  // Donut (green)
  `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36"><circle cx="18" cy="18" r="14" fill="%23deb887" stroke="%23c4a067" stroke-width="1"/><circle cx="18" cy="18" r="12" fill="%234caf50"/><circle cx="18" cy="18" r="5" fill="%230a1628"/><circle cx="12" cy="13" r="1.5" fill="%23ff6b9d"/><circle cx="22" cy="12" r="1.5" fill="%23ffd93d"/><circle cx="24" cy="20" r="1.5" fill="%234a9eff"/><circle cx="14" cy="22" r="1.5" fill="%23ff9800"/></svg>`,
  // Ice cream (yellow)
  `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="44" viewBox="0 0 36 44"><polygon points="12,22 24,22 18,42" fill="%23deb887" stroke="%23c4a067" stroke-width="1"/><circle cx="18" cy="16" r="10" fill="%23ffd93d" stroke="%23fff" stroke-width="1"/><circle cx="14" cy="13" r="3" fill="%23ffeb3b"/><circle cx="21" cy="12" r="2" fill="%23fff176"/><circle cx="18" cy="8" r="3" fill="%23ff6b9d"/></svg>`,
  // Candy (purple)
  `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="28" viewBox="0 0 40 28"><ellipse cx="20" cy="14" rx="10" ry="10" fill="%239c27b0" stroke="%23fff" stroke-width="1.5"/><ellipse cx="20" cy="14" rx="6" ry="6" fill="%23ba68c8"/><path d="M10 14c-3-4-8-4-8 0s5 4 8 0" fill="%23e1bee7"/><path d="M30 14c3-4 8-4 8 0s-5 4-8 0" fill="%23e1bee7"/><circle cx="17" cy="11" r="2" fill="%23ce93d8"/></svg>`,
];

const REACHED_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36"><circle cx="18" cy="18" r="16" fill="%234caf50" stroke="%23fff" stroke-width="2"/><path d="M12 18l4 4 8-8" stroke="%23fff" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

function createIcon(svgString: string, size: [number, number]): L.Icon {
  return L.icon({
    iconUrl: `data:image/svg+xml,${svgString}`,
    iconSize: size,
    iconAnchor: [size[0] / 2, size[1] / 2],
    popupAnchor: [0, -size[1] / 2],
  });
}

interface WaypointMarkerProps {
  waypoint: Waypoint;
  index: number;
}

export default function WaypointMarker({ waypoint, index }: WaypointMarkerProps) {
  const icon = waypoint.reached
    ? createIcon(REACHED_SVG, [36, 36])
    : createIcon(CANDY_SVGS[waypoint.iconIndex % CANDY_SVGS.length], [36, 44]);

  return (
    <Marker
      position={[waypoint.position.lat, waypoint.position.lng]}
      icon={icon}
    >
      <Popup>
        <div style={{ textAlign: 'center', color: '#333' }}>
          <strong>Waypoint {index + 1}</strong>
          <br />
          {waypoint.reached ? '✅ Reached!' : '📍 Walk here!'}
        </div>
      </Popup>
    </Marker>
  );
}
