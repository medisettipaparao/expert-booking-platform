const express = require('express');
const { createBooking, getBookings, updateBookingStatus, getAvailableSlots } = require('../controllers/bookingController');

const router = express.Router();

router.post('/', createBooking);
router.get('/', getBookings);
router.patch('/:id/status', updateBookingStatus);
router.get('/slots/:expertId', getAvailableSlots);

module.exports = router;
