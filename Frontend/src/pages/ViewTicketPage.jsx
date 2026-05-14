import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { viewTicket } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Card, PaymentBadge, Button, Alert } from '../components/UI';

export default function ViewTicketPage() {
  const { bookingId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const printRef = useRef();

  const userId = user?.id || user?.username;

  useEffect(() => {
    viewTicket(bookingId, userId)
      .then(r => setTicket(r.data))
      .catch(() => setError('Could not load ticket. Make sure your payment is verified.'))
      .finally(() => setLoading(false));
  }, [bookingId]);

  const handlePrint = () => window.print();

  if (loading) return <div style={{ padding: '80px', textAlign: 'center' }}><span className="spinner" /></div>;

  return (
    <div style={{ maxWidth: '560px', margin: '0 auto', padding: '40px 24px' }}>
      <button
        onClick={() => navigate('/user/bookings')}
        style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px', cursor: 'pointer' }}
      >
        ← Back to Bookings
      </button>

      {error ? (
        <Alert type="error" message={error} />
      ) : ticket ? (
        <>
          <div ref={printRef}>
            {/* Ticket card */}
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              overflow: 'hidden',
            }}>
              {/* Header strip */}
              <div style={{
                background: 'linear-gradient(135deg, var(--accent) 0%, #ff9a5c 100%)',
                padding: '28px 28px 24px',
                position: 'relative',
              }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.75)', marginBottom: '6px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  🎪 FestManage · E-Ticket
                </div>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 800, color: '#fff', margin: 0 }}>
                  {ticket.bookingKey}
                </h1>
                {/* Decorative circles */}
                <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
                <div style={{ position: 'absolute', top: 20, right: 40, width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
              </div>

              {/* Tear line */}
              <div style={{ display: 'flex', alignItems: 'center', padding: '0 0', position: 'relative' }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--bg)', border: '1px solid var(--border)', marginLeft: -10, flexShrink: 0 }} />
                <div style={{ flex: 1, borderTop: '2px dashed var(--border)', margin: '0 8px' }} />
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--bg)', border: '1px solid var(--border)', marginRight: -10, flexShrink: 0 }} />
              </div>

              {/* Body */}
              <div style={{ padding: '24px 28px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Details grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {[
                    { label: 'Attendee', value: ticket.userId },
                    { label: 'Slots', value: `${ticket.slots} seat(s)` },
                    { label: 'Booking Date', value: ticket.bookingDatetime ? new Date(ticket.bookingDatetime).toLocaleString() : '—' },
                    { label: 'Payment', value: <PaymentBadge status={ticket.paymentStatus} /> },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>{label}</p>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{value}</p>
                    </div>
                  ))}
                </div>

                {/* Booking key */}
                {ticket.bookingKey && (
                  <div style={{
                    background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)', padding: '16px', textAlign: 'center',
                  }}>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
                      Booking Key — show this at entry
                    </p>
                    <p style={{
                      fontFamily: 'monospace', fontSize: '22px', fontWeight: 700,
                      color: 'var(--accent)', letterSpacing: '0.12em', wordBreak: 'break-all',
                    }}>
                      {ticket.bookingKey}
                    </p>
                  </div>
                )}

                {/* Warning if not verified */}
                {ticket.paymentStatus !== 'PAYMENT_VERIFIED' && (
                  <div style={{
                    background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)',
                    borderRadius: 'var(--radius-sm)', padding: '12px 14px',
                    fontSize: '13px', color: 'var(--warning)',
                  }}>
                    ⚠️ Your payment has not been verified yet. The booking key will be active once verified by the organiser.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <Button variant="ghost" onClick={() => navigate('/user/bookings')} style={{ flex: 1 }}>← Bookings</Button>
            <Button onClick={handlePrint} style={{ flex: 1 }}>🖨 Print Ticket</Button>
          </div>

          <style>{`
            @media print {
              body * { visibility: hidden; }
              #root * { visibility: hidden; }
              [data-print-area], [data-print-area] * { visibility: visible; }
            }
          `}</style>
        </>
      ) : null}
    </div>
  );
}