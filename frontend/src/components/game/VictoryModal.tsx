import { formatTime, formatDistance } from '../../utils/formatters';
import Button from '../common/Button';

interface VictoryModalProps {
  elapsed: number;
  distance: number;
  waypointCount: number;
  onPlayAgain: () => void;
}

const confettiColors = ['#ff6b6b', '#4a9eff', '#4caf50', '#ffd93d', '#9c27b0', '#ff9800'];

export default function VictoryModal({ elapsed, distance, waypointCount, onPlayAgain }: VictoryModalProps) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      background: 'rgba(10, 22, 40, 0.9)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
    }}>
      {/* Confetti */}
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'fixed',
            bottom: '-20px',
            left: `${Math.random() * 100}%`,
            width: `${8 + Math.random() * 8}px`,
            height: `${8 + Math.random() * 8}px`,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            background: confettiColors[i % confettiColors.length],
            animation: `confetti ${2 + Math.random() * 3}s ease-out ${Math.random() * 1}s forwards`,
            opacity: 0.8,
          }}
        />
      ))}

      <div style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border)',
        padding: '48px 40px',
        textAlign: 'center',
        maxWidth: '380px',
        width: 'calc(100% - 40px)',
        animation: 'slideUp 0.5s ease',
        boxShadow: 'var(--shadow-glow)',
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: 800,
          margin: '0 0 8px',
          background: 'linear-gradient(135deg, #4a9eff, #6db3ff, #4caf50)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Hai vinto!
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '28px', fontSize: '0.95rem' }}>
          You reached all {waypointCount} waypoints!
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          marginBottom: '28px',
        }}>
          <StatBox label="Time" value={formatTime(elapsed)} />
          <StatBox label="Distance" value={formatDistance(distance)} />
        </div>

        <Button fullWidth onClick={onPlayAgain} style={{ fontSize: '1rem', padding: '14px' }}>
          Play Again
        </Button>
      </div>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      background: 'var(--bg-secondary)',
      borderRadius: 'var(--radius)',
      padding: '12px',
      border: '1px solid var(--border)',
    }}>
      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {label}
      </div>
      <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
        {value}
      </div>
    </div>
  );
}
