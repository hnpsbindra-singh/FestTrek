import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as loginApi } from '../services/api';
import { Button, Input, Alert, Card } from '../components/UI';

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const { data: token } = await loginApi(form);
      // Decode role from JWT payload
      const payload = JSON.parse(atob(token.split('.')[1]));
      const role = payload.role || (payload.authorities?.[0]?.replace('ROLE_', ''));
      login(token, { username: form.username, name: form.username, role });
      navigate(role === 'ORGANISER' ? '/organiser/events' : '/user/explore');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px 20px',
      background: 'radial-gradient(ellipse 60% 60% at 50% 0%, rgba(255,107,53,0.06) 0%, transparent 70%)',
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }} className="animate-in">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            width: 56, height: 56, borderRadius: '14px', background: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '24px', color: '#fff',
            margin: '0 auto 20px',
          }}>F</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 800, marginBottom: '8px' }}>
            Welcome back
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Sign in to your account</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Input
              label="Username"
              type="text"
              placeholder="your_username"
              value={form.username}
              onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              required
            />
            <div style={{ textAlign: 'right' }}>
              <Link to="/forgot-password" style={{ fontSize: '13px', color: 'var(--accent)' }}>
                Forgot password?
              </Link>
            </div>
            <Alert type="error" message={error} />
            <Button type="submit" loading={loading} style={{ width: '100%', marginTop: '4px' }}>
              Sign In
            </Button>
          </form>
        </Card>

        <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-secondary)', fontSize: '14px' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 500 }}>Create one</Link>
        </p>
      </div>
    </div>
  );
}
