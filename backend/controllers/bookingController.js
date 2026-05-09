const Booking = require('../models/Booking');

exports.createBooking = async (req, res) => {
  try {
    const { expertId, name, email, phone, date, timeSlot, notes } = req.body;
    
    // Basic Validation
    if (!expertId || !name || !email || !phone || !date || !timeSlot) {
      return res.status(400).json({ error: 'All fields except notes are required.' });
    }

    // Creating Booking (this will throw if unique index is violated)
    const newBooking = new Booking({
      expertId, name, email, phone, date, timeSlot, notes
    });

    await newBooking.save();

    // Emit Real-Time Update
    const io = req.app.get('io');
    if (io) {
      io.emit('booking_created', {
        expertId,
        date,
        timeSlot
      });
    }

    res.status(201).json({ message: 'Booking successful', booking: newBooking });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'This time slot is already booked. Please choose another.' });
    }
    res.status(500).json({ error: 'Server Error' });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ error: 'Email query parameter is required.' });
    }

    const bookings = await Booking.find({ email }).populate('expertId', 'name category image').sort({ date: 1, timeSlot: 1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Pending', 'Confirmed', 'Completed', 'Cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status.' });
    }

    const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!booking) return res.status(404).json({ error: 'Booking not found.' });

    // If cancelled, emit socket event to free up the slot
    if (status === 'Cancelled') {
      const io = req.app.get('io');
      if (io) {
        io.emit('booking_cancelled', {
          expertId: booking.expertId,
          date: booking.date,
          timeSlot: booking.timeSlot
        });
      }
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

exports.getAvailableSlots = async (req, res) => {
  try {
    const { expertId } = req.params;
    // We just return bookings for that expert to calculate available slots on the frontend,
    // or we can calculate here. Returning bookings is easier.
    const bookings = await Booking.find({ expertId, status: { $ne: 'Cancelled' } });
    res.json(bookings.map(b => ({ date: b.date, timeSlot: b.timeSlot })));
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};
