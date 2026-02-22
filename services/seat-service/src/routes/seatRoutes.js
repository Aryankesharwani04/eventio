import express from 'express';
import { getSeat, bookSeat, addSeat } from '../controllers/seatController.js';

const router = express.Router();

router.get('/seat/:seatNumber', getSeat);
router.put('/book', bookSeat);
router.post('/', addSeat);

export default router;
