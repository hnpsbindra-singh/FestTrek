import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { myBookings, submitPayment } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Card, Badge, PaymentBadge, Button, Alert } from '../components/UI';

export default function MyBookingsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paying, setPaying] = useState(null);

  const userId = user?.id || user?.username;

  const fetchBookings = async () => {
    try {
      const { data } = await myBookings(userId);
      setBookings(data);
    } catch {
      setError('Failed to load bookings.');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handlePay = async (bookingId) => {
    
    setPaying(bookingId);
    try {
      await submitPayment(bookingId, userId);
      fetchBookings();
    } catch (err) {
      setError('Payment submission failed.');
    } finally { setPaying(null); }
  };

  if (loading) return <div style={{ padding: '80px', textAlign: 'center' }}><span className="spinner" /></div>;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '36px', fontWeight: 800, marginBottom: '8px' }}>
        My <span style={{ color: 'var(--accent)' }}>Bookings</span>
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Manage your event tickets and payments</p>

      <Alert type="error" message={error} />

      {bookings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '56px', marginBottom: '16px' }}>🎟</div>
          <p style={{ marginBottom: '20px' }}>No bookings yet. Go explore some events!</p>
          <Button onClick={() => navigate('/user/explore')}>Explore Events</Button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {bookings.map(b => (
            <Card key={b.festId + b.bookingDatetime}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <p style={{ fontWeight: 600, marginBottom: '6px' }}>Fest ID: <span style={{ color: 'var(--text-secondary)', fontWeight: 400, fontSize: '13px' }}>{b.festId}</span></p>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                    <span>🎟 {b.slots} slot(s)</span>
                    <span>💰 ₹{b.totalCost}</span>
                    <span>📅 {new Date(b.bookingDatetime).toLocaleDateString()}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <PaymentBadge status={b.paymentStatus} />
                  {b.paymentStatus === 'PAYMENT_PENDING' && (
                    <Button size="sm" loading={paying === b.id} onClick={() => handlePay(b.id)}>
                      Submit Payment
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => navigate(`/user/ticket/${b.id}`)}>
                    View Ticket
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
