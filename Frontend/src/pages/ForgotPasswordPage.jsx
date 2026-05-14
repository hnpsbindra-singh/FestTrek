import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPasswordOtp, resetPassword } from '../services/api';
import { Button, Input, Alert, Card } from '../components/UI';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(0); // 0=enter username, 1=reset
  const [username, setUsername] = useState('');
  const [form, setForm] = useState({ otp: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await forgotPasswordOtp(username);
      setSuccess('OTP sent!');
      setStep(1);
    } catch (err) {
      setError('Could not send OTP. Check the username.');
    } finally { setLoading(false); }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await resetPassword({ username, otp: form.otp, password: form.password });
      setSuccess('Password reset! Redirecting…');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed. Invalid OTP?');
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px',
    }}>
      <div style={{ width: '100%', maxWidth: '400px' }} className="animate-in">
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>Reset Password</h1>
          <p style={{ color: 'var(--text-secondary)' }}>We'll send you a one-time password.</p>
        </div>
        <Card>
          {step === 0 ? (
            <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Input label="Username" value={username} onChange={e => setUsername(e.target.value)} placeholder="your_username" required />
              <Alert type="error" message={error} />
              <Button type="submit" loading={loading} style={{ width: '100%' }}>Send OTP</Button>
            </form>
          ) : (
            <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Alert type="success" message={success} />
              <Input label="OTP Code" value={form.otp} onChange={e => setForm(f => ({ ...f, otp: e.target.value }))} placeholder="123456" required />
              <Input label="New Password" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="••••••••" required />
              <Alert type="error" message={error} />
              <Button type="submit" loading={loading} style={{ width: '100%' }}>Reset Password</Button>
            </form>
          )}
        </Card>
        <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-secondary)', fontSize: '14px' }}>
          <Link to="/login" style={{ color: 'var(--accent)' }}>← Back to login</Link>
        </p>
      </div>
    </div>
  );
}
