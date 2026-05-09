const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  expertId: { type: mongoose.Schema.Types.ObjectId, ref: 'Expert', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  date: { type: String, required: true }, // Format YYYY-MM-DD
  timeSlot: { type: String, required: true }, // Format HH:MM
  notes: { type: String },
  status: { type: String, enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'], default: 'Confirmed' }
}, { timestamps: true });

bookingSchema.index(
  { expertId: 1, date: 1, timeSlot: 1 }, 
  { unique: true, partialFilterExpression: { status: { $ne: 'Cancelled' } } }
);

module.exports = mongoose.model('Booking', bookingSchema);
