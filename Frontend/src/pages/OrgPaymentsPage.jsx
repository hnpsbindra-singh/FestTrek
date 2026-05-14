import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { viewPendingPayments, acceptPayment, verifyTicket } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Card, Badge, PaymentBadge, Button, Alert, Input, Modal } from '../components/UI';

export default function OrgPaymentsPage() {
  const { festId } = useParams();
  const { user } = useAuth();
  const organiserId = user?.id || user?.username;

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [approving, setApproving] = useState(null);

  const [verifyModal, setVerifyModal] = useState(false);
  const [bookingKey, setBookingKey] = useState('');
  const [verifyResult, setVerifyResult] = useState('');
  const [verifying, setVerifying] = useState(false);

  const fetchPayments = async () => {
    try {
      const { data } = await viewPendingPayments(organiserId, festId);
      setPayments(data);
    } catch {
      setError('Failed to load payment requests.');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchPayments(); }, []);

  const handleApprove = async (bookingId) => {
    setApproving(bookingId);
    try {
      await acceptPayment(bookingId);
      fetchPayments();
    } catch {
      setError('Approval failed.');
    } finally { setApproving(null); }
  };

  const handleVerify = async () => {
    setVerifying(true); setVerifyResult('');
    try {
      const { data } = await verifyTicket(bookingKey, organiserId);
      setVerifyResult(data);
    } catch (err) {
      setVerifyResult('Invalid or already used ticket.');
    } finally { setVerifying(false); }
  };

  if (loading) return <div style={{ padding: '80px', textAlign: 'center' }}><span className="spinner" /></div>;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 800, marginBottom: '4px' }}>
            Payment <span style={{ color: 'var(--accent)' }}>Requests</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Fest ID: {festId}</p>
        </div>
        <Button variant="ghost" onClick={() => setVerifyModal(true)}>🎟 Verify Ticket</Button>
      </div>

      <Alert type="error" message={error} />

      {payments.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>💳</div>
          <p>No pending payment requests.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {payments.map((p, i) => (
            <Card key={i}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <p style={{ fontWeight: 600, marginBottom: '6px' }}>User: <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>{p.userId}</span></p>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--text-muted)' }}>
                    <span>🎟 {p.slots} slot(s)</span>
                    <span>💰 ₹{p.totalCost}</span>
                    <span>📅 {p.bookingDatetime ? new Date(p.bookingDatetime).toLocaleDateString() : '—'}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <PaymentBadge status={p.paymentStatus} />
                  {p.paymentStatus === 'PAYMENT_SUBMITTED' && (
                    <Button size="sm" variant="success" loading={approving === p.id} onClick={() => handleApprove(p.id)}>
                      Approve
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={verifyModal} onClose={() => { setVerifyModal(false); setVerifyResult(''); }} title="Verify Ticket">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Enter the booking key from the attendee's ticket.</p>
          <Input label="Booking Key" value={bookingKey} onChange={e => setBookingKey(e.target.value)} placeholder="e.g. ABC123XYZ" />
          {verifyResult && (
            <div style={{
              padding: '14px', borderRadius: 'var(--radius-sm)', fontSize: '14px', fontWeight: 500,
              background: verifyResult.toLowerCase().includes('invalid') ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)',
              color: verifyResult.toLowerCase().includes('invalid') ? 'var(--error)' : 'var(--success)',
              border: `1px solid ${verifyResult.toLowerCase().includes('invalid') ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)'}`,
            }}>{verifyResult}</div>
          )}
          <Button loading={verifying} onClick={handleVerify}>Verify</Button>
        </div>
      </Modal>
    </div>
  );
}
