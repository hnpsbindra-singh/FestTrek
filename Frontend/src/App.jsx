import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ExplorePage from './pages/ExplorePage';
import EventDetailPage from './pages/EventDetailPage';
import MyBookingsPage from './pages/MyBookingsPage';
import ViewTicketPage from './pages/ViewTicketPage';
import OrgEventsPage from './pages/OrgEventsPage';
import AddEventPage from './pages/AddEventPage';
import OrgPaymentsPage from './pages/OrgPaymentsPage';

function ProtectedRoute({ children, role }) {
  const { isLoggedIn, user } = useAuth();
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (role && user?.role !== role) return <Navigate to="/" replace />;
  return children;
}

function HomePage() {
  const { isLoggedIn, user } = useAuth();
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return <Navigate to={user?.role === 'ORGANISER' ? '/organiser/events' : '/user/explore'} replace />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* User routes */}
          <Route path="/user/explore" element={<ProtectedRoute role="USER"><ExplorePage /></ProtectedRoute>} />
          <Route path="/user/event/:festId" element={<ProtectedRoute role="USER"><EventDetailPage /></ProtectedRoute>} />
          <Route path="/user/bookings" element={<ProtectedRoute role="USER"><MyBookingsPage /></ProtectedRoute>} />
          <Route path="/user/ticket/:bookingId" element={<ProtectedRoute role="USER"><ViewTicketPage /></ProtectedRoute>} />

          {/* Organiser routes */}
          <Route path="/organiser/events" element={<ProtectedRoute role="ORGANISER"><OrgEventsPage /></ProtectedRoute>} />
          <Route path="/organiser/add-event" element={<ProtectedRoute role="ORGANISER"><AddEventPage /></ProtectedRoute>} />
          <Route path="/organiser/payments/:festId" element={<ProtectedRoute role="ORGANISER"><OrgPaymentsPage /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;