import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function Input({ label, error, style, ...props }: InputProps) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={{
        display: 'block',
        marginBottom: '6px',
        fontSize: '0.85rem',
        fontWeight: 500,
        color: 'var(--text-secondary)',
      }}>
        {label}
      </label>
      <input
        style={{
          width: '100%',
          padding: '12px 16px',
          borderRadius: 'var(--radius)',
          border: `1px solid ${error ? 'var(--danger)' : 'var(--border)'}`,
          background: 'var(--bg-input)',
          color: 'var(--text-primary)',
          fontSize: '0.95rem',
          outline: 'none',
          transition: 'border-color var(--transition)',
          ...style,
        }}
        {...props}
      />
      {error && (
        <span style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>
          {error}
        </span>
      )}
    </div>
  );
}
