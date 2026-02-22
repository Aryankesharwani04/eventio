import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
app.use(morgan('dev'));

const AUTH_SERVICE_URL         = process.env.AUTH_SERVICE_URL         || 'http://localhost:3001';
const BOOKING_SERVICE_URL      = process.env.BOOKING_SERVICE_URL      || 'http://localhost:3002';
const SEAT_SERVICE_URL         = process.env.SEAT_SERVICE_URL         || 'http://localhost:3003';
const PAYMENT_SERVICE_URL      = process.env.PAYMENT_SERVICE_URL      || 'http://localhost:3004';
const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3005';

// Auth routes
app.use('/auth', createProxyMiddleware({ target: AUTH_SERVICE_URL, changeOrigin: true }));

// Booking routes
app.use('/api/bookings', createProxyMiddleware({ target: BOOKING_SERVICE_URL, changeOrigin: true }));
app.use('/api/book',     createProxyMiddleware({ target: BOOKING_SERVICE_URL, changeOrigin: true }));

// Seat routes
app.use('/seats', createProxyMiddleware({ target: SEAT_SERVICE_URL, changeOrigin: true }));

// Payment routes
app.use('/payment', createProxyMiddleware({ target: PAYMENT_SERVICE_URL, changeOrigin: true }));

// Notification routes
app.use('/notifications', createProxyMiddleware({ target: NOTIFICATION_SERVICE_URL, changeOrigin: true }));

// Health check
app.get('/health', (req, res) => res.status(200).json({ status: 'ok', service: 'api-gateway' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API Gateway running on http://localhost:${PORT}`);
});
