const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId:     { type: String, required: true, index: true },
    seatNumber: { type: String, required: true },
    showId:     { type: String, required: true, default: 'default-show' },
}, { timestamps: true });

// Composite unique index — one booking per seat per show
bookingSchema.index({ seatNumber: 1, showId: 1 }, { unique: true });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
