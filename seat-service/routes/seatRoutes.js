const express = require('express');
const router = express.Router();
const seatController = require('../controllers/seatController');

// Define routes
router.get('/seat/:seatNumber', seatController.getSeat);
router.get('/seat/A12', seatController.getSeat);
router.put('/seat/book', seatController.bookSeat);
router.post('/seat', seatController.addSeat);

module.exports = router;
