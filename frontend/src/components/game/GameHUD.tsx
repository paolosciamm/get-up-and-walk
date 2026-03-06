import { formatTime, formatDistance } from '../../utils/formatters';

interface GameHUDProps {
  elapsed: number;
  distance: number;
  reached: number;
  total: number;
}

export default function GameHUD({ elapsed, distance, reached, total }: GameHUDProps) {
  return (
    <div style={{
      position: 'absolute',
      top: '70px',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: '8px',
      zIndex: 1000,
      animation: 'fadeIn 0.3s ease',
    }}>
      <HUDItem label="Time" value={formatTime(elapsed)} icon="⏱" />
      <HUDItem label="Distance" value={formatDistance(distance)} icon="📏" />
      <HUDItem label="Waypoints" value={`${reached}/${total}`} icon="🎯" />
    </div>
  );
}

function HUDItem({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div style={{
      background: 'var(--bg-overlay)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderRadius: 'var(--radius)',
      border: '1px solid var(--border)',
      padding: '8px 14px',
      minWidth: '90px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {icon} {label}
      </div>
      <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
        {value}
      </div>
    </div>
  );
}
