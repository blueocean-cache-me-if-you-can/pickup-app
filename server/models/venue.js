const mongoose = require('mongoose');

// Venue Schema
const venueSchema = new mongoose.Schema({
  address: { type: String, required: true },
  verified: { type: Boolean, required: true, default: false }
});

const Venue = mongoose.model('Venue', venueSchema);

module.exports = Venue;