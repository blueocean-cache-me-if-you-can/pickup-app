const mongoose = require('mongoose');

// Venue Schema
const venueSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
});

const Venue = mongoose.model('Venue', venueSchema);

module.exports = Venue;