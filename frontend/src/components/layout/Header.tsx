import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '56px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px',
      background: 'var(--bg-overlay)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
      zIndex: 1000,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '20px' }}>🚶</span>
        <span style={{
          fontSize: '1rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
        }}>
          Get Up and Walk
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {user && (
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {user.username}
          </span>
        )}
        <Button
          variant="secondary"
          onClick={logout}
          style={{ padding: '6px 14px', fontSize: '0.8rem' }}
        >
          Logout
        </Button>
      </div>
    </header>
  );
}
