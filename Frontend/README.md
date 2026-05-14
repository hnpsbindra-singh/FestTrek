# FestManagement UI

React + Vite frontend for the FestManagement Spring Boot backend.

## Tech Stack

- **React 18** with React Router v6
- **Vite** build tool
- **Axios** for API calls
- Custom CSS design system (no UI framework)

## Setup

```bash
# Install dependencies
npm install

# Start dev server (proxies /api → localhost:8080)
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx       # Top navigation bar
│   └── UI.jsx           # Reusable components (Button, Input, Card, Modal, Badge…)
├── context/
│   └── AuthContext.jsx  # JWT auth state (login/logout, persisted in localStorage)
├── pages/
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx          # Multi-step: fill form → verify OTP
│   ├── ForgotPasswordPage.jsx    # Send OTP → reset password
│   ├── ExplorePage.jsx           # Browse events by lat/lng/radius
│   ├── EventDetailPage.jsx       # View event + book tickets
│   ├── MyBookingsPage.jsx        # User's bookings + submit payment
│   ├── OrgEventsPage.jsx         # Organiser: manage events
│   ├── AddEventPage.jsx          # Organiser: create event
│   └── OrgPaymentsPage.jsx       # Organiser: approve payments + verify tickets
├── services/
│   └── api.js           # Axios instance + all API calls mapped to backend endpoints
├── App.jsx              # Router + protected routes
├── main.jsx
└── index.css            # Global CSS variables & design tokens
```

## Backend Endpoints Covered

| Method | Endpoint | UI Page |
|--------|----------|---------|
| POST | `/api/auth/register` | RegisterPage |
| POST | `/api/auth/login` | LoginPage |
| POST | `/api/auth/send-otp` | RegisterPage |
| POST | `/api/auth/verify-otp` | RegisterPage |
| POST | `/api/auth/forgot-password-otp` | ForgotPasswordPage |
| POST | `/api/auth/reset-password` | ForgotPasswordPage |
| GET  | `/api/user/view-All-Events-nearby` | ExplorePage |
| GET  | `/api/user/view-event/:id` | EventDetailPage |
| POST | `/api/user/Book-Ticket/:id` | EventDetailPage |
| POST | `/api/user/submit-payment/:id` | MyBookingsPage |
| GET  | `/api/user/my-bookings` | MyBookingsPage |
| POST | `/api/organiser/addEvent` | AddEventPage |
| GET  | `/api/organiser/view-all-events` | OrgEventsPage |
| PUT  | `/api/organiser/cancel-event/:id` | OrgEventsPage |
| GET  | `/api/organiser/view-pending-payments/:id` | OrgPaymentsPage |
| POST | `/api/organiser/acceptPayment/:id/approve` | OrgPaymentsPage |
| POST | `/api/organiser/verify-ticket` | OrgPaymentsPage |

## Auth Notes

- JWT token is stored in `localStorage` as `fm_token`
- Role (`USER` / `ORGANISER`) is decoded from the JWT payload
- Protected routes redirect to `/login` if unauthenticated
- Role-based routing: organisers go to `/organiser/events`, users go to `/user/explore`
