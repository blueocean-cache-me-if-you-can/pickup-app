const mongoose = require('mongoose');

// Event Schema
const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  owner: { userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, displayName: String },
  sport: { type: mongoose.Schema.Types.ObjectId, ref: 'Activity', required: true },
  brief_description: { type: String },
  description: { type: String },
  additional_info: { type: String },
  photo: { type: String },
  time: { type: Date, required: true },
  locationName: { type: String, required: true },
  location: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue', required: true },
  intensityId: { type: mongoose.Schema.Types.ObjectId, ref: 'IntensityLevel', required: true },
  skillId: { type: mongoose.Schema.Types.ObjectId, ref: 'SkillLevel', required: true },
  minPlayers: { type: Number, required: true },
  maxPlayers: { type: Number, required: true },
  players: [{ userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, displayName: String }],
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;