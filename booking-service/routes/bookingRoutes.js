const express = require('express');
const axios = require('axios');
const Booking = require('../models/Booking');
const router = express.Router();

// POST /book - Book a seat if available (ensure concurrency safety)
router.post('/book', async (req, res) => {
    const { userId, seatNumber } = req.body;

    try {
        // Check if the seat is already booked
        const seatResponse = await axios.get(`http://localhost:5002/api/seat/${seatNumber}`);
        const seat = seatResponse.data;

        if(seat.isBooked){
            return res.status(409).send({ message: 'Seat already booked' });
        }

        // Update seat status to booked
        await axios.put(`http://localhost:5002/api/seat/book`, { seatNumber, userId });

        // Save the booking
        const booking = new Booking({ userId, seatNumber });
        await booking.save();
        res.status(201).send(booking);
    } catch (error) {
        if (error.response && error.response.status === 404) {
            // Seat not found, create a new seat
            await axios.post('http://localhost:5002/api/seat', { seatNumber, isBooked: true });
            const booking = new Booking({ userId, seatNumber });
            await booking.save();
            res.status(201).send(booking);
        } else {
            res.status(500).send(error);
        }
    }
});

// GET /bookings - Fetch all bookings
router.get('/bookings', async (req, res) => {
    try {
        const bookings = await Booking.find();
        res.status(200).send(bookings);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
