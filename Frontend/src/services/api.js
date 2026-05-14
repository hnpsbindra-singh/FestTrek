import axios from 'axios';

const BASE_URL = '/api';

const api = axios.create({ baseURL: BASE_URL });

// Attach JWT token to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('fm_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── Auth ────────────────────────────────────────────────────
export const register = (data) => api.post('/auth/register', data);
export const login    = (data) => api.post('/auth/login', data);
export const sendOtp  = (username) => api.post('/auth/send-otp', null, { params: { username } });
export const verifyOtp = (username, otp) => api.post('/auth/verify-otp', null, { params: { username, otp } });
export const forgotPasswordOtp = (username) => api.post('/auth/forgot-password-otp', null, { params: { username } });
export const resetPassword = (data) => api.post('/auth/reset-password', data);

// ─── User ────────────────────────────────────────────────────
export const viewEventsNearby = (latitude, longitude, radiusKm) =>
  api.get('/user/view-All-Events-nearby', { params: { latitude, longitude, radiusKm } });

export const viewEventDetail = (festId) => api.get(`/user/view-event/${festId}`);

export const bookTicket = (festId, userId, data) =>
  api.post(`/user/Book-Ticket/${festId}`, data, { params: { userId } });

export const submitPayment = (bookingId, userId) =>
  api.post(`/user/submit-payment/${bookingId}`, null, { params: { userId } });

export const myBookings = (userId) => api.get('/user/my-bookings', { params: { userId } });

export const viewTicket = (bookingId, userId) =>
  api.get(`/user/ticket/${bookingId}`, { params: { userId } });

// ─── Organiser ───────────────────────────────────────────────
export const addEvent = (data, organiserId) =>
  api.post('/organiser/addEvent', data, { params: { organiserId } });

export const acceptPayment = (id) => api.post(`/organiser/acceptPayment/${id}/approve`);

export const viewAllOrgEvents = (organiserId) =>
  api.get('/organiser/view-all-events', { params: { organiserId } });

export const viewPendingPayments = (organiserId, festId) =>
  api.get(`/organiser/view-pending-payments/${festId}`, { params: { organiserId } });

export const cancelEvent = (festId, organiserId) =>
  api.put(`/organiser/cancel-event/${festId}`, null, { params: { organiserId } });

export const verifyTicket = (bookingkey, organiserId) =>
  api.post('/organiser/verify-ticket', bookingkey, { params: { organiserId } });

export default api;
