import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register, sendOtp, verifyOtp } from '../services/api';
import { Button, Input, Alert, Card, Badge } from '../components/UI';

const STEPS = ['Details', 'Verify Email', 'Done'];

export default function RegisterPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: '', role: 'USER', username: '', password: '', mobile: '',
    upiId: '', bankAccountNumber: '', ifscCode: '', accountHolderName: '',
  });
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));
  const isOrganiser = form.role === 'ORGANISER';

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await register(form);
      await sendOtp(form.username);
      setSuccess('OTP sent to your registered email.');
      setStep(1);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally { setLoading(false); }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await verifyOtp(form.username, otp);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px 20px',
      background: 'radial-gradient(ellipse 60% 60% at 50% 0%, rgba(124,58,237,0.06) 0%, transparent 70%)',
    }}>
      <div style={{ width: '100%', maxWidth: '520px' }} className="animate-in">
        {/* Step indicators */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '40px' }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '13px', fontWeight: 700,
                background: i <= step ? 'var(--accent)' : 'var(--bg-elevated)',
                color: i <= step ? '#fff' : 'var(--text-muted)',
                border: `1px solid ${i <= step ? 'var(--accent)' : 'var(--border)'}`,
                transition: 'all 0.3s',
              }}>{i + 1}</div>
              <span style={{ fontSize: '13px', color: i <= step ? 'var(--text-primary)' : 'var(--text-muted)' }}>{s}</span>
              {i < STEPS.length - 1 && <div style={{ width: 32, height: 1, background: 'var(--border)', margin: '0 4px' }} />}
            </div>
          ))}
        </div>

        <Card>
          {step === 0 && (
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>Create Account</h2>

              {/* Role selector */}
              <div>
                <label style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500, display: 'block', marginBottom: '8px' }}>I am a</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {['USER', 'ORGANISER'].map(r => (
                    <button key={r} type="button" onClick={() => setForm(f => ({ ...f, role: r }))} style={{
                      flex: 1, padding: '10px', borderRadius: 'var(--radius-sm)', fontSize: '14px', fontWeight: 600,
                      background: form.role === r ? 'var(--accent-soft)' : 'var(--bg-elevated)',
                      border: `1px solid ${form.role === r ? 'var(--accent)' : 'var(--border)'}`,
                      color: form.role === r ? 'var(--accent)' : 'var(--text-secondary)',
                      cursor: 'pointer', transition: 'all 0.2s',
                    }}>{r === 'USER' ? '🎟 Attendee' : '🎪 Organiser'}</button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <Input label="Full Name" value={form.name} onChange={set('name')} placeholder="John Doe" required />
                <Input label="Username" value={form.username} onChange={set('username')} placeholder="johndoe" required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <Input label="Password" type="password" value={form.password} onChange={set('password')} placeholder="••••••••" required />
                <Input label="Mobile" value={form.mobile} onChange={set('mobile')} placeholder="+91 9999..." required />
              </div>

              {isOrganiser && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>💳 Payment Details</p>
                  <Input label="Account Holder Name" value={form.accountHolderName} onChange={set('accountHolderName')} placeholder="John Doe" />
                  <Input label="UPI ID" value={form.upiId} onChange={set('upiId')} placeholder="johndoe@upi" />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <Input label="Bank Account No." value={form.bankAccountNumber} onChange={set('bankAccountNumber')} placeholder="XXXXXXXXXXXXXXXX" />
                    <Input label="IFSC Code" value={form.ifscCode} onChange={set('ifscCode')} placeholder="SBIN0000XXX" />
                  </div>
                </div>
              )}

              <Alert type="error" message={error} />
              <Button type="submit" loading={loading} style={{ width: '100%', marginTop: '4px' }}>Create Account</Button>
            </form>
          )}

          {step === 1 && (
            <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, marginBottom: '4px' }}>Verify OTP</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Enter the OTP sent to your registered contact.</p>
              <Alert type="success" message={success} />
              <Input label="OTP Code" value={otp} onChange={e => setOtp(e.target.value)} placeholder="123456" required />
              <Alert type="error" message={error} />
              <Button type="submit" loading={loading} style={{ width: '100%' }}>Verify</Button>
            </form>
          )}

          {step === 2 && (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{ fontSize: '56px', marginBottom: '16px' }}>🎉</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>You're in!</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Account verified successfully.</p>
              <Button onClick={() => navigate('/login')} style={{ width: '100%' }}>Continue to Login</Button>
            </div>
          )}
        </Card>

        {step === 0 && (
          <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-secondary)', fontSize: '14px' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 500 }}>Sign in</Link>
          </p>
        )}
      </div>
    </div>
  );
}
