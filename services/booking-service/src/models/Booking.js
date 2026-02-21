const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    seatNumber: { type: String, required: true, unique: true }
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
