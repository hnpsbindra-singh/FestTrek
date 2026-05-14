import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { viewAllOrgEvents, cancelEvent } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Card, Badge, Button, Alert } from '../components/UI';

export default function OrgEventsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(null);

  const organiserId = user?.id || user?.username;

  const fetchEvents = async () => {
    try {
      const { data } = await viewAllOrgEvents(organiserId);
      setEvents(data);
    } catch {
      setError('Failed to load events.');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchEvents(); }, []);

  const handleCancel = async (festId) => {
    if (!window.confirm('Cancel this event?')) return;
    setCancelling(festId);
    try {
      await cancelEvent(festId, organiserId);
      fetchEvents();
    } catch {
      setError('Failed to cancel event.');
    } finally { setCancelling(null); }
  };

  if (loading) return <div style={{ padding: '80px', textAlign: 'center' }}><span className="spinner" /></div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '36px', fontWeight: 800, marginBottom: '8px' }}>
            My <span style={{ color: 'var(--accent)' }}>Events</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>{events.length} event(s) created</p>
        </div>
        <Button onClick={() => navigate('/organiser/add-event')}>+ Add Event</Button>
      </div>

      <Alert type="error" message={error} />

      {events.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '56px', marginBottom: '16px' }}>🎪</div>
          <p style={{ marginBottom: '20px' }}>No events yet. Create your first one!</p>
          <Button onClick={() => navigate('/organiser/add-event')}>Create Event</Button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {events.map(ev => (
            <Card key={ev.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '18px' }}>{ev.title}</h3>
                    {ev.active ? <Badge color="green">Active</Badge> : <Badge color="red">Cancelled</Badge>}
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '12px', lineHeight: 1.5 }}>{ev.description}</p>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                    <span>📅 {ev.date} at {ev.time}</span>
                    <span>🎟 {ev.slots} slots</span>
                    <span>💰 ₹{ev.cost}</span>
                    <span>⏱ {ev.duration}</span>
                    {ev.genre && <span>🎭 {ev.genre}</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '140px' }}>
                  <Button size="sm" variant="ghost" onClick={() => navigate(`/organiser/payments/${ev.id}`)}>
                    View Payments
                  </Button>
                  {ev.active && (
                    <Button size="sm" variant="danger" loading={cancelling === ev.id} onClick={() => handleCancel(ev.id)}>
                      Cancel Event
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
