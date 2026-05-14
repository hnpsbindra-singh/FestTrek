import { useState } from 'react';

/* ── Button ── */
export function Button({ children, variant = 'primary', size = 'md', loading, className = '', ...props }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    gap: '8px', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-display)',
    fontWeight: 600, border: 'none', transition: 'all 0.2s', cursor: props.disabled || loading ? 'not-allowed' : 'pointer',
    opacity: props.disabled || loading ? 0.6 : 1,
  };
  const sizes = {
    sm: { padding: '8px 14px', fontSize: '13px' },
    md: { padding: '11px 20px', fontSize: '14px' },
    lg: { padding: '14px 28px', fontSize: '16px' },
  };
  const variants = {
    primary: { background: 'var(--accent)', color: '#fff' },
    ghost: { background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border)' },
    danger: { background: 'rgba(239,68,68,0.15)', color: 'var(--error)', border: '1px solid rgba(239,68,68,0.3)' },
    success: { background: 'rgba(34,197,94,0.15)', color: 'var(--success)', border: '1px solid rgba(34,197,94,0.3)' },
  };
  return (
    <button style={{ ...base, ...sizes[size], ...variants[variant] }} className={className} {...props}>
      {loading ? <span className="spinner" style={{width:16,height:16}} /> : null}
      {children}
    </button>
  );
}

/* ── Input ── */
export function Input({ label, error, className = '', style = {}, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {label && <label style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</label>}
      <input
        style={{
          background: 'var(--bg-elevated)', border: `1px solid ${error ? 'var(--error)' : 'var(--border)'}`,
          borderRadius: 'var(--radius-sm)', padding: '11px 14px', color: 'var(--text-primary)',
          fontSize: '14px', outline: 'none', transition: 'border-color 0.2s',
          ...style,
        }}
        onFocus={e => e.target.style.borderColor = error ? 'var(--error)' : 'var(--accent)'}
        onBlur={e => e.target.style.borderColor = error ? 'var(--error)' : 'var(--border)'}
        {...props}
      />
      {error && <span style={{ fontSize: '12px', color: 'var(--error)' }}>{error}</span>}
    </div>
  );
}

/* ── Card ── */
export function Card({ children, className = '', style = {}, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
        padding: '24px', transition: 'border-color 0.2s, box-shadow 0.2s',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
      onMouseEnter={onClick ? (e) => { e.currentTarget.style.borderColor = 'var(--border-bright)'; e.currentTarget.style.boxShadow = 'var(--shadow)'; } : undefined}
      onMouseLeave={onClick ? (e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; } : undefined}
      className={className}
    >
      {children}
    </div>
  );
}

/* ── Badge ── */
export function Badge({ children, color = 'default' }) {
  const colors = {
    default: { background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border)' },
    orange: { background: 'var(--accent-soft)', color: 'var(--accent)', border: '1px solid rgba(255,107,53,0.3)' },
    green: { background: 'rgba(34,197,94,0.1)', color: 'var(--success)', border: '1px solid rgba(34,197,94,0.3)' },
    yellow: { background: 'rgba(245,158,11,0.1)', color: 'var(--warning)', border: '1px solid rgba(245,158,11,0.3)' },
    red: { background: 'rgba(239,68,68,0.1)', color: 'var(--error)', border: '1px solid rgba(239,68,68,0.3)' },
    purple: { background: 'rgba(124,58,237,0.1)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.3)' },
  };
  return (
    <span style={{
      display: 'inline-block', padding: '3px 10px', borderRadius: '99px',
      fontSize: '12px', fontWeight: 600, letterSpacing: '0.02em',
      ...colors[color],
    }}>{children}</span>
  );
}

/* ── Modal ── */
export function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px',
    }} onClick={onClose}>
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
        padding: '32px', maxWidth: '480px', width: '100%', maxHeight: '90vh', overflowY: 'auto',
        animation: 'fadeIn 0.2s ease',
      }} onClick={e => e.stopPropagation()}>
        {title && <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, marginBottom: '24px' }}>{title}</h2>}
        {children}
      </div>
    </div>
  );
}

/* ── Alert ── */
export function Alert({ type = 'error', message }) {
  if (!message) return null;
  const styles = {
    error: { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--error)' },
    success: { background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: 'var(--success)' },
    info: { background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.3)', color: '#a78bfa' },
  };
  return (
    <div style={{ ...styles[type], borderRadius: 'var(--radius-sm)', padding: '12px 16px', fontSize: '14px' }}>
      {message}
    </div>
  );
}

/* ── PaymentStatus Badge ── */
export function PaymentBadge({ status }) {
  const map = {
    PAYMENT_PENDING: ['yellow', 'Pending'],
    PAYMENT_SUBMITTED: ['purple', 'Submitted'],
    PAYMENT_VERIFIED: ['green', 'Verified'],
    PAYMENT_REJECTED: ['red', 'Rejected'],
  };
  const [color, label] = map[status] || ['default', status];
  return <Badge color={color}>{label}</Badge>;
}
