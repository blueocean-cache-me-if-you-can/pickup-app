const mongoose = require('mongoose');

// User Interested Activities Schema
const userInterestedActivitiesSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  activityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Activity', required: true },
  skillLevelId: { type: mongoose.Schema.Types.ObjectId, ref: 'SkillLevel', required: true },
});

const UserInterestedActivity = mongoose.model('UserInterestedActivity', userInterestedActivitiesSchema);

module.exports = UserInterestedActivity;