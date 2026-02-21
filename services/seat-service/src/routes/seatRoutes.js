const express = require('express');
const router = express.Router();
const seatController = require('../controllers/seatController');

// GET  /seats/seat/:seatNumber  — get a single seat's status
router.get('/seat/:seatNumber', seatController.getSeat);

// PUT  /seats/book              — mark a seat as booked
router.put('/book', seatController.bookSeat);

// POST /seats                   — create a new seat record
router.post('/', seatController.addSeat);

module.exports = router;
