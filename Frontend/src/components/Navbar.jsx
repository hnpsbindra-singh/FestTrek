import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from './UI';

export default function Navbar() {
  const { user, logout, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isOrganiser = user?.role === 'ORGANISER';

  const navLinks = isLoggedIn
    ? isOrganiser
      ? [
          { to: '/organiser/events', label: 'My Events' },
          { to: '/organiser/add-event', label: 'Add Event' },
        ]
      : [
          { to: '/user/explore', label: 'Explore' },
          { to: '/user/bookings', label: 'My Bookings' },
        ]
    : [];

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 32px', height: '64px',
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: 32, height: 32, borderRadius: '8px',
          background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '16px', color: '#fff',
        }}>F</div>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '18px', color: 'var(--text-primary)' }}>
          FestTrack
        </span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {navLinks.map(({ to, label }) => (
          <Link key={to} to={to} style={{
            padding: '8px 14px', borderRadius: 'var(--radius-sm)', fontSize: '14px',
            fontWeight: 500, color: location.pathname === to ? 'var(--accent)' : 'var(--text-secondary)',
            background: location.pathname === to ? 'var(--accent-soft)' : 'transparent',
            transition: 'all 0.2s',
          }}>{label}</Link>
        ))}

        {isLoggedIn ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '8px' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '6px 12px', borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-elevated)', border: '1px solid var(--border)',
            }}>
              <div style={{
                width: 24, height: 24, borderRadius: '50%',
                background: 'var(--accent)', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: '#fff',
              }}>
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{user?.name}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>Logout</Button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '8px', marginLeft: '8px' }}>
            <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>Login</Button>
            <Button size="sm" onClick={() => navigate('/register')}>Register</Button>
          </div>
        )}
      </div>
    </nav>
  );
}
