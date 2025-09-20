const mongoose = require('mongoose');

// Activity Schema
const activitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  placeholderImage: { type: String },
  image: { type: String },
});

const Activity = mongoose.model('Activity', activitySchema, 'activities');

module.exports = Activity;