const mongoose = require('mongoose');

const expertSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  experience: { type: Number, required: true }, // in years
  rating: { type: Number, default: 0 },
  image: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Expert', expertSchema);
