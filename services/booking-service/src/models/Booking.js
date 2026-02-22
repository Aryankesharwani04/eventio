import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    userId:     { type: String, required: true, index: true },
    seatNumber: { type: String, required: true },
    showId:     { type: String, required: true, default: 'default-show' },
}, { timestamps: true });

bookingSchema.index({ seatNumber: 1, showId: 1 }, { unique: true });

export default mongoose.model('Booking', bookingSchema);
