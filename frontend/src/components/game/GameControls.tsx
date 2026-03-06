import Button from '../common/Button';
import type { GamePhase } from '../../types/game';

interface GameControlsProps {
  phase: GamePhase;
  onNewGame: () => void;
  onStart: () => void;
  onStop: () => void;
  onPlayAgain: () => void;
}

export default function GameControls({ phase, onNewGame, onStart, onStop, onPlayAgain }: GameControlsProps) {
  return (
    <div style={{
      position: 'absolute',
      bottom: '24px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 1000,
      display: 'flex',
      gap: '12px',
    }}>
      {phase === 'idle' && (
        <Button onClick={onNewGame} style={{ padding: '14px 32px', fontSize: '1rem', boxShadow: 'var(--shadow-glow)' }}>
          New Game
        </Button>
      )}

      {phase === 'configuring' && (
        <Button onClick={onStart} style={{ padding: '14px 32px', fontSize: '1rem', boxShadow: 'var(--shadow-glow)' }}>
          Start Walking!
        </Button>
      )}

      {phase === 'playing' && (
        <Button variant="danger" onClick={onStop} style={{ padding: '14px 32px', fontSize: '1rem' }}>
          Stop Game
        </Button>
      )}

      {phase === 'won' && (
        <Button onClick={onPlayAgain} style={{ padding: '14px 32px', fontSize: '1rem', boxShadow: 'var(--shadow-glow)' }}>
          Play Again
        </Button>
      )}
    </div>
  );
}
