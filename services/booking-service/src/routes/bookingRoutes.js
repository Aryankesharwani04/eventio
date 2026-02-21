const express = require('express');
const axios = require('axios');
const Booking = require('../models/Booking');
const { acquireSeatLock, releaseSeatLock } = require('../utils/seatLock');

const router = express.Router();

const SEAT_SERVICE_URL = process.env.SEAT_SERVICE_URL || 'http://localhost:3003';

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/book
// ─────────────────────────────────────────────────────────────────────────────
router.post('/book', async (req, res) => {
  const { userId, seatNumber, showId = 'default-show' } = req.body;

  if (!userId || !seatNumber) {
    return res.status(400).json({ message: 'userId and seatNumber are required' });
  }

  // ── 1. Try Redis lock ──────────────────────────────────────────────────────
  const locked = await acquireSeatLock(showId, seatNumber, userId);

  if (!locked) {
    return res.status(409).json({
      message: 'Seat is temporarily locked. Another booking is in progress.',
      code: 'SEAT_LOCKED',
    });
  }

  // ── 2-4. Business flow — always release lock in catch ─────────────────────
  try {
    // 2. Verify seat exists & availability via seat-service
    let seat;
    try {
      const seatResponse = await axios.get(`${SEAT_SERVICE_URL}/seats/seat/${seatNumber}`);
      seat = seatResponse.data;
    } catch (err) {
      if (err.response && err.response.status === 404) {
        seat = { isBooked: false }; // seat doesn't exist yet, will be created
      } else {
        throw err;
      }
    }

    if (seat.isBooked) {
      return res.status(409).json({
        message: 'Seat is already booked.',
        code: 'SEAT_ALREADY_BOOKED',
      });
    }

    // 3. Mark seat as reserved in seat-service
    try {
      await axios.put(`${SEAT_SERVICE_URL}/seats/book`, { seatNumber, userId });
    } catch (err) {
      if (err.response && err.response.status === 404) {
        // Seat record doesn't exist — create it
        await axios.post(`${SEAT_SERVICE_URL}/seats`, { seatNumber, isBooked: true, userId });
      } else {
        throw err;
      }
    }

    // 4. Save booking in MongoDB
    const booking = new Booking({ userId, seatNumber, showId });
    await booking.save();

    return res.status(201).json({ message: 'Booking successful', booking });

  } catch (error) {
    console.error('[Booking] Error:', error.message);
    return res.status(500).json({ message: 'Booking failed', error: error.message });

  } finally {
    // Always release lock — whether success, business failure, or exception
    await releaseSeatLock(showId, seatNumber).catch(() => {});
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/bookings
// ─────────────────────────────────────────────────────────────────────────────
router.get('/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

module.exports = router;
