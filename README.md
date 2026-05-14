# FestRix 🎟️

FestRix is a full-stack event management and ticket booking platform built using Spring Boot, MongoDB, React, and JWT Authentication.

The platform allows organisers to create and manage events while users can discover nearby events, book tickets, submit payments, and receive verified entry passes.

---

# 🚀 Features

## 🔐 Authentication & Security
- JWT-based authentication
- Protected APIs using Spring Security
- Role-based access (User / Organiser)
- Secure route validation

---

## 📍 Geo-Based Event Discovery
- Nearby event search using MongoDB GeoSpatial queries
- GeoJSON location storage
- 2dsphere indexing for efficient distance queries

---

## 🎫 Ticket Booking System
- Event ticket booking
- Slot availability checks
- Booking lifecycle management:
  - PAYMENT_PENDING
  - PAYMENT_SUBMITTED
  - PAYMENT_VERIFIED

---

## 💳 Manual Payment Verification Workflow
- Users receive organiser payment details through email
- Users submit payment confirmation
- Organisers manually verify payments
- Booking status updates automatically

---

## 📧 Email Integration
- Payment instructions mailed to users
- Verified ticket confirmation emails
- Booking key generation after approval

---

## 🎟 Ticket Verification System
- Unique booking key generated for every verified booking
- Organisers can verify attendee tickets
- Duplicate entry prevention using check-in tracking

---

## 🛠 Organiser Features
- Add new events
- View all created events
- View pending payment requests
- Approve bookings
- Verify attendee tickets
- Soft delete events

---

# 🧠 Tech Stack

## Backend
- Java
- Spring Boot
- Spring Security
- JWT
- Spring Data MongoDB
- JavaMailSender

## Frontend
- React
- Axios
- React Router

## Database
- MongoDB

---

# 🗺 Geo Query Implementation

Fest locations are stored using MongoDB GeoJSON format:

```json
{
  "type": "Point",
  "coordinates": [longitude, latitude]
}
