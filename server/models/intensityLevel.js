const mongoose = require('mongoose');

// Intensity Level Schema
const intensityLevelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  displayOrder: { type: Number, min: 0, max: 9, required: true },
});

const IntensityLevel = mongoose.model('IntensityLevel', intensityLevelSchema, 'intensityLevel');

module.exports = IntensityLevel;