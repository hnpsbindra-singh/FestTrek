import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { viewEventDetail, bookTicket } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Button, Card, Badge, Alert, Modal, Input } from '../components/UI';

export default function EventDetailPage() {
  const { festId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookModal, setBookModal] = useState(false);
  const [slots, setSlots] = useState(1);
  const [booking, setBooking] = useState(false);
  const [bookError, setBookError] = useState('');
  const [booked, setBooked] = useState(null);

  useEffect(() => {
    viewEventDetail(festId)
      .then(r => setEvent(r.data))
      .catch(() => setError('Failed to load event.'))
      .finally(() => setLoading(false));
  }, [festId]);

  const handleBook = async () => {
    setBooking(true); setBookError('');
    try {
      const { data } = await bookTicket(festId, user.id || user.username, { festId, slots: Number(slots) });
      setBooked(data);
      setBookModal(false);
    } catch (err) {
      setBookError(err.response?.data?.message || 'Booking failed.');
    } finally { setBooking(false); }
  };

  if (loading) return <div style={{ padding: '80px', textAlign: 'center' }}><span className="spinner" /></div>;
  if (error) return <div style={{ padding: '40px', textAlign: 'center' }}><Alert type="error" message={error} /></div>;
  if (!event) return null;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }} className="animate-in">
      <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
        ← Back
      </button>

      {booked && (
        <div style={{ marginBottom: '24px', padding: '20px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 'var(--radius)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ color: 'var(--success)', fontWeight: 700, marginBottom: '4px' }}>🎉 Booking Confirmed!</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Total: ₹{booked.totalCost} · {booked.slots} slot(s)</p>
          </div>
          <Button size="sm" onClick={() => navigate('/user/bookings')}>View Bookings</Button>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '36px', fontWeight: 800, marginBottom: '12px' }}>{event.title}</h1>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {event.genre && <Badge color="purple">{event.genre}</Badge>}
            {event.language && <Badge>{event.language}</Badge>}
            <Badge color="orange">₹{event.cost}/slot</Badge>
          </div>
        </div>
        {!booked && (
          <Button size="lg" onClick={() => setBookModal(true)}>Book Tickets</Button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
        {[
          { label: 'Date', value: event.date, icon: '📅' },
          { label: 'Time', value: event.time, icon: '🕐' },
          { label: 'Duration', value: event.duration, icon: '⏱' },
          { label: 'Available Slots', value: event.slots, icon: '🎟' },
          { label: 'Age Limit', value: event.ageLimit ? `${event.ageLimit}+` : 'All ages', icon: '🎂' },
          { label: 'Language', value: event.language || '—', icon: '🌐' },
        ].map(({ label, value, icon }) => (
          <Card key={label} style={{ padding: '16px' }}>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>{icon} {label}</p>
            <p style={{ fontWeight: 600 }}>{value}</p>
          </Card>
        ))}
      </div>

      <Card>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>About this Event</h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>{event.description}</p>
      </Card>

      <Modal open={bookModal} onClose={() => setBookModal(false)} title="Book Tickets">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Booking for: <strong style={{ color: 'var(--text-primary)' }}>{event.title}</strong></p>
          <Input label="Number of Slots" type="number" min="1" max={event.slots} value={slots} onChange={e => setSlots(e.target.value)} />
          <div style={{ padding: '14px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Total Cost</span>
            <strong style={{ color: 'var(--accent)', fontSize: '18px' }}>₹{slots * event.cost}</strong>
          </div>
          <Alert type="error" message={bookError} />
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button variant="ghost" onClick={() => setBookModal(false)} style={{ flex: 1 }}>Cancel</Button>
            <Button loading={booking} onClick={handleBook} style={{ flex: 1 }}>Confirm Booking</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
