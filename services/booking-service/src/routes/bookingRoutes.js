import express from 'express';
import axios from 'axios';
import Booking from '../models/Booking.js';
import { acquireSeatLock, releaseSeatLock } from '../utils/seatLock.js';

const router = express.Router();

const SEAT_SERVICE_URL = process.env.SEAT_SERVICE_URL || 'http://localhost:3003';

// POST /api/book
router.post('/book', async (req, res) => {
  const { userId, seatNumber, showId = 'default-show' } = req.body;

  if (!userId || !seatNumber) {
    return res.status(400).json({ message: 'userId and seatNumber are required' });
  }

  const locked = await acquireSeatLock(showId, seatNumber, userId);

  if (!locked) {
    return res.status(409).json({
      message: 'Seat is temporarily locked. Another booking is in progress.',
      code: 'SEAT_LOCKED',
    });
  }

  try {
    let seat;
    try {
      const seatResponse = await axios.get(`${SEAT_SERVICE_URL}/seats/seat/${seatNumber}`);
      seat = seatResponse.data;
    } catch (err) {
      if (err.response && err.response.status === 404) {
        seat = { isBooked: false };
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

    try {
      await axios.put(`${SEAT_SERVICE_URL}/seats/book`, { seatNumber, userId });
    } catch (err) {
      if (err.response && err.response.status === 404) {
        await axios.post(`${SEAT_SERVICE_URL}/seats`, { seatNumber, isBooked: true, userId });
      } else {
        throw err;
      }
    }

    const booking = new Booking({ userId, seatNumber, showId });
    await booking.save();

    return res.status(201).json({ message: 'Booking successful', booking });

  } catch (error) {
    console.error('[Booking] Error:', error.message);
    return res.status(500).json({ message: 'Booking failed', error: error.message });

  } finally {
    await releaseSeatLock(showId, seatNumber, userId).catch(() => {});
  }
});

// GET /api/bookings
router.get('/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

export default router;
