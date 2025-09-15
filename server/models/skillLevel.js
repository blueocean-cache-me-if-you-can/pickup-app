const mongoose = require('mongoose');

// Skill Level Schema
const skillLevelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  displayOrder: { type: Number, min: 0, max: 9, required: true },
});

const SkillLevel = mongoose.model('SkillLevel', skillLevelSchema);

module.exports = SkillLevel;