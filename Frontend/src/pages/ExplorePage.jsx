import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { viewEventsNearby } from '../services/api';
import { Button, Input, Card, Badge, Alert } from '../components/UI';

export default function ExplorePage() {
  const [coords, setCoords] = useState({ latitude: '', longitude: '', radiusKm: '50' });
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);
  const navigate = useNavigate();

  const useMyLocation = () => {
    navigator.geolocation.getCurrentPosition(
      pos => setCoords(c => ({ ...c, latitude: pos.coords.latitude.toFixed(6), longitude: pos.coords.longitude.toFixed(6) })),
      () => setError('Could not fetch location.')
    );
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const { data } = await viewEventsNearby(coords.latitude, coords.longitude, coords.radiusKm);
      setEvents(data);
      setSearched(true);
    } catch (err) {
      setError('Failed to fetch events.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '40px', fontWeight: 800, marginBottom: '8px' }}>
          Explore <span style={{ color: 'var(--accent)' }}>Events</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>Find fests and shows happening near you</p>
      </div>

      <Card style={{ marginBottom: '40px' }}>
        <form onSubmit={handleSearch}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 160px auto', gap: '14px', alignItems: 'end' }}>
            <Input label="Latitude" value={coords.latitude} onChange={e => setCoords(c => ({...c, latitude: e.target.value}))} placeholder="28.6139" required type="number" step="any" />
            <Input label="Longitude" value={coords.longitude} onChange={e => setCoords(c => ({...c, longitude: e.target.value}))} placeholder="77.2090" required type="number" step="any" />
            <Input label="Radius (km)" value={coords.radiusKm} onChange={e => setCoords(c => ({...c, radiusKm: e.target.value}))} placeholder="50" type="number" />
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button type="button" variant="ghost" onClick={useMyLocation}>📍 My Location</Button>
              <Button type="submit" loading={loading}>Search</Button>
            </div>
          </div>
        </form>
      </Card>

      <Alert type="error" message={error} />

      {searched && (
        <div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '20px' }}>
            {events.length} event{events.length !== 1 ? 's' : ''} found
          </p>
          {events.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
              <p>No events found in this area. Try a larger radius.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
              {events.map(event => (
                <EventCard key={event.id} event={event} onClick={() => navigate(`/user/event/${event.id}`)} />
              ))}
            </div>
          )}
        </div>
      )}

      {!searched && (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '56px', marginBottom: '16px' }}>🎪</div>
          <p style={{ fontSize: '16px' }}>Enter your coordinates or use your current location to discover events</p>
        </div>
      )}
    </div>
  );
}

function EventCard({ event, onClick }) {
  return (
    <Card onClick={onClick} style={{ cursor: 'pointer' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '18px', lineHeight: 1.3 }}>{event.title}</h3>
          <Badge color="orange">₹{event.cost}</Badge>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {event.description}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {event.genre && <Badge color="purple">{event.genre}</Badge>}
          {event.language && <Badge>{event.language}</Badge>}
          {event.ageLimit && <Badge>18+ only</Badge>}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-muted)', paddingTop: '8px', borderTop: '1px solid var(--border)' }}>
          <span>📅 {event.date}</span>
          <span>🎟 {event.slots} slots</span>
          <span>⏱ {event.duration}</span>
        </div>
      </div>
    </Card>
  );
}
