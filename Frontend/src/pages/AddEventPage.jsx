import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addEvent } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Card, Alert } from '../components/UI';

export default function AddEventPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', description: '', date: '', time: '',
    slots: '', cost: '', duration: '', ageLimit: '',
    language: '', genre: '',
    location: { type: 'Point', coordinates: ['', ''] },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState('');

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setLocError('Geolocation is not supported by your browser.');
      return;
    }
    setLocating(true); setLocError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm(f => ({
          ...f,
          location: {
            type: 'Point',
            coordinates: [
              pos.coords.longitude.toFixed(6),
              pos.coords.latitude.toFixed(6),
            ],
          },
        }));
        setLocating(false);
      },
      () => {
        setLocError('Could not fetch location. Please allow location access and try again.');
        setLocating(false);
      }
    );
  };

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));
  const setCoord = (idx) => (e) => setForm(f => ({
    ...f,
    location: { ...f.location, coordinates: f.location.coordinates.map((v, i) => i === idx ? e.target.value : v) }
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const payload = {
        ...form,
        slots: Number(form.slots),
        cost: Number(form.cost),
        ageLimit: Number(form.ageLimit),
        location: {
          type: 'Point',
          coordinates: [parseFloat(form.location.coordinates[0]), parseFloat(form.location.coordinates[1])],
        },
      };
      await addEvent(payload, user?.id || user?.username);
      navigate('/organiser/events');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create event.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '40px 24px' }}>
      <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px', cursor: 'pointer' }}>
        ← Back
      </button>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '36px', fontWeight: 800, marginBottom: '32px' }}>
        Create <span style={{ color: 'var(--accent)' }}>Event</span>
      </h1>

      <Card>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Input label="Event Title" value={form.title} onChange={set('title')} placeholder="Summer Music Festival" required />
          <div>
            <label style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Description</label>
            <textarea
              value={form.description} onChange={set('description')} placeholder="Describe your event..."
              rows={4} required
              style={{
                width: '100%', background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)', padding: '11px 14px', color: 'var(--text-primary)',
                fontSize: '14px', outline: 'none', resize: 'vertical', fontFamily: 'var(--font-body)',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <Input label="Date" type="date" value={form.date} onChange={set('date')} required />
            <Input label="Time" type="time" value={form.time} onChange={set('time')} required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
            <Input label="Total Slots" type="number" value={form.slots} onChange={set('slots')} placeholder="500" required />
            <Input label="Cost (₹)" type="number" value={form.cost} onChange={set('cost')} placeholder="499" required />
            <Input label="Duration" value={form.duration} onChange={set('duration')} placeholder="3 hours" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
            <Input label="Age Limit" type="number" value={form.ageLimit} onChange={set('ageLimit')} placeholder="18" />
            <Input label="Language" value={form.language} onChange={set('language')} placeholder="Hindi" />
            <Input label="Genre" value={form.genre} onChange={set('genre')} placeholder="Music" />
          </div>

          <div style={{ padding: '16px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>📍 Event Location (GeoJSON)</p>
              <Button type="button" variant="ghost" size="sm" loading={locating} onClick={useMyLocation}>
                📍 My Location
              </Button>
            </div>
            {locError && <Alert type="error" message={locError} />}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: locError ? '10px' : 0 }}>
              <Input label="Longitude" type="number" step="any" value={form.location.coordinates[0]} onChange={setCoord(0)} placeholder="77.2090" required />
              <Input label="Latitude" type="number" step="any" value={form.location.coordinates[1]} onChange={setCoord(1)} placeholder="28.6139" required />
            </div>
          </div>

          <Alert type="error" message={error} />
          <Button type="submit" loading={loading} size="lg" style={{ width: '100%' }}>Create Event</Button>
        </form>
      </Card>
    </div>
  );
}