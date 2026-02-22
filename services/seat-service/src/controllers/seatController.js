import Seat from '../models/Seat.js';

export const getSeat = async (req, res) => {
    try {
        const { seatNumber } = req.params;
        const seat = await Seat.findOne({ seatNumber });
        if (!seat) {
            return res.status(404).send({ error: 'Seat not found' });
        }
        res.status(200).send({ isBooked: seat.isBooked });
    } catch (error) {
        res.status(400).send({ error: 'Error fetching seat' });
    }
};

export const bookSeat = async (req, res) => {
    try {
        const { userId, seatNumber } = req.body;
        const seat = await Seat.findOne({ seatNumber });
        if (!seat) {
            return res.status(404).send({ error: 'Seat not found' });
        }
        if (seat.isBooked) {
            return res.status(409).send({ message: 'Seat already booked' });
        }
        if (!userId) {
            return res.status(400).send({ error: 'User ID is required' });
        }
        seat.isBooked = true;
        seat.user = userId;
        await seat.save();
        res.status(200).send({ message: 'Seat booked successfully' });
    } catch (error) {
        res.status(400).send({ error: 'Error booking seat' });
    }
};

export const addSeat = async (req, res) => {
    try {
        const { seatNumber, isBooked } = req.body;
        const seat = new Seat({ seatNumber, isBooked });
        await seat.save();
        res.status(201).send({ message: 'Seat added successfully' });
    } catch (error) {
        res.status(400).send({ error: 'Error adding seat' });
    }
};
