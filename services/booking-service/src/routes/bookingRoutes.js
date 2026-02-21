const express = require('express');
const axios = require('axios');
const Booking = require('../models/Booking');
const { acquireLock, releaseLock, getLockStatus } = require('../services/seatLockService');

const router = express.Router();

// Seat service URL resolved from environment (supports both local and Docker)
const SEAT_SERVICE_URL = process.env.SEAT_SERVICE_URL || 'http://localhost:3003';

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/book  — Book a seat with Redis-based distributed lock
// ─────────────────────────────────────────────────────────────────────────────
//
// Flow:
//   1. Acquire Redis lock  (SET seat:{showId}:{seatNumber} userId NX EX 300)
//   2. If lock not acquired → 409 seat already being booked
//   3. Check seat availability from seat-service
//   4. If seat taken  → release lock, 409 seat already booked
//   5. Mark seat as booked via seat-service
//   6. Save booking to MongoDB
//   7. Release Redis lock (payment success / confirmed)
//   8. Return 201 with booking
//
// TTL auto-releases lock after 300s if the client crashes before step 7.
//
router.post('/book', async (req, res) => {
  // Support both seatNumber-only (legacy) and showId+seatNumber (distributed)
  const { userId, seatNumber, showId = 'default-show' } = req.body;

  if (!userId || !seatNumber) {
    return res.status(400).json({ message: 'userId and seatNumber are required' });
  }

  // ── STEP 1: Acquire distributed lock ──────────────────────────────────────
  let lockAcquired = false;
  try {
    const { acquired, ownedBySameUser } = await acquireLock(showId, seatNumber, userId);

    if (!acquired) {
      return res.status(409).json({
        message: 'Seat is currently being booked by another user. Please try again shortly.',
        code: 'SEAT_LOCKED',
      });
    }

    lockAcquired = true;

    if (ownedBySameUser) {
      console.log(`[Booking] User ${userId} re-entered lock for seat ${seatNumber} (idempotent retry)`);
    }

    // ── STEP 2: Check seat availability from seat-service ─────────────────
    let seat;
    try {
      const seatResponse = await axios.get(`${SEAT_SERVICE_URL}/seats/seat/${seatNumber}`);
      seat = seatResponse.data;
    } catch (axiosErr) {
      if (axiosErr.response && axiosErr.response.status === 404) {
        // Seat doesn't exist yet — will be created on booking
        seat = { isBooked: false };
      } else {
        throw axiosErr; // Network error → propagate to outer catch
      }
    }

    if (seat.isBooked) {
      // ── Release lock before returning — seat is permanently booked ────────
      await releaseLock(showId, seatNumber, userId);
      return res.status(409).json({
        message: 'Seat is already booked.',
        code: 'SEAT_ALREADY_BOOKED',
      });
    }

    // ── STEP 3: Mark seat as booked via seat-service ────────────────────────
    try {
      await axios.put(`${SEAT_SERVICE_URL}/seats/book`, { seatNumber, userId });
    } catch (axiosErr) {
      if (axiosErr.response && axiosErr.response.status === 404) {
        // Seat record doesn't exist yet — create it
        await axios.post(`${SEAT_SERVICE_URL}/seats`, { seatNumber, isBooked: true, userId });
      } else {
        throw axiosErr;
      }
    }

    // ── STEP 4: Persist booking in MongoDB ──────────────────────────────────
    const booking = new Booking({ userId, seatNumber, showId });
    await booking.save();

    // ── STEP 5: Release lock (booking confirmed = payment path complete) ─────
    await releaseLock(showId, seatNumber, userId);

    return res.status(201).json({
      message: 'Booking successful',
      booking,
    });

  } catch (error) {
    // Always release lock on unexpected errors to prevent seat being stuck
    if (lockAcquired) {
      await releaseLock(showId, seatNumber, userId).catch(() => {});
    }

    console.error('[Booking] Error during booking flow:', error.message);

    // Detect Redis down — provide graceful degradation message
    if (error.message && error.message.includes('ECONNREFUSED') && error.message.includes('6379')) {
      return res.status(503).json({
        message: 'Booking service temporarily unavailable (cache unreachable). Please try again.',
        code: 'CACHE_UNAVAILABLE',
      });
    }

    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/bookings  — Fetch all bookings
// ─────────────────────────────────────────────────────────────────────────────
router.get('/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/lock-status/:showId/:seatNumber  — Check current lock status
// (Useful for debugging / admin tooling)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/lock-status/:showId/:seatNumber', async (req, res) => {
  const { showId, seatNumber } = req.params;
  try {
    const status = await getLockStatus(showId, seatNumber);
    res.status(200).json({
      showId,
      seatNumber,
      ...status,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to check lock status', error: error.message });
  }
});

module.exports = router;
