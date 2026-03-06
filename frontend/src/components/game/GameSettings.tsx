import Slider from '../common/Slider';
import Button from '../common/Button';

interface GameSettingsProps {
  radiusMeters: number;
  waypointCount: number;
  onRadiusChange: (value: number) => void;
  onWaypointCountChange: (value: number) => void;
  onGenerate: () => void;
  loading: boolean;
}

export default function GameSettings({
  radiusMeters,
  waypointCount,
  onRadiusChange,
  onWaypointCountChange,
  onGenerate,
  loading,
}: GameSettingsProps) {
  return (
    <div style={{
      position: 'absolute',
      bottom: '80px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: 'calc(100% - 32px)',
      maxWidth: '400px',
      background: 'var(--bg-card)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border)',
      padding: '24px',
      zIndex: 1000,
      boxShadow: 'var(--shadow-lg)',
      animation: 'slideUp 0.3s ease',
    }}>
      <h3 style={{
        margin: '0 0 20px',
        fontSize: '1rem',
        fontWeight: 600,
        color: 'var(--text-primary)',
      }}>
        Game Settings
      </h3>

      <Slider
        label="Radius"
        value={radiusMeters}
        min={200}
        max={5000}
        step={100}
        formatValue={(v) => v >= 1000 ? `${(v / 1000).toFixed(1)} km` : `${v} m`}
        onChange={onRadiusChange}
      />

      <Slider
        label="Waypoints"
        value={waypointCount}
        min={1}
        max={30}
        step={1}
        onChange={onWaypointCountChange}
      />

      <Button fullWidth onClick={onGenerate} loading={loading}>
        Generate Waypoints
      </Button>
    </div>
  );
}
