const mongoose = require('mongoose');

// Event Schema
const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  owner: { userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, displayName: String },
  brief_description: { type: String },
  description: { type: String },
  additional_info: { type: String },
  photo: { type: String },
  time: { type: Date, required: true },
  address: { type: String, required: true },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  activityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Activity', required: true },
  intensityId: { type: mongoose.Schema.Types.ObjectId, ref: 'IntensityLevel', required: true },
  skillId: { type: mongoose.Schema.Types.ObjectId, ref: 'SkillLevel', required: true },
  minPlayers: { type: Number, required: true },
  maxPlayers: { type: Number, required: true },
  players: [{_id: false, userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, displayName: String }],
});

eventSchema.index({ location: "2dsphere" });

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;