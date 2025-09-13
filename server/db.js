//Whether we use MongoDB or another database, this file will handle the connection logic.


// All Tables/Collections:

//user: defines all current users
// id
// displayName - Optional, default to firstName + ’  ‘ + lastName
// firstName - required
// lastName - required
// email - primary - required
// email - secondary - Optional
// Password - required, format
// address - required
// photo - (url vs file system) - Optional
// Calendar - required?
// atLeastEighteen - required
// acceptTOS - stretch
// acceptPrivacy - stretch

// userInterestedActivites: - optional
// Id
// userId
// activityId
// skillLevelId

// skillLevel:
// id
// name
// rating (0-9)

// intensity:
// id
// name
// rating (0-9)

// activities: - defines the list of athletic activities currently supported
// id
// name
// Image

// venue:
// id
// name
// address
// latitude
// Longitude

// event: defines event info
// id
// title
// sport
// smallDescription
// description
// additionalInfo
// photo
// time (includes date) - should the time be converted to local time in be or fe?
// locationName
// location
// intensityId
// skillId
// minPlayers
// maxPlayers
// players: [{ userId, displayName}]

//MongoDB schema design:
// Collections: users, activities, venues, events, skillLevels, intensityLevels, userInterestedActivities

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/pickupApp', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;

// User Schema
const userSchema = new mongoose.Schema({
  displayName: { type: String },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  emailPrimary: { type: String, required: true, unique: true },
  emailSecondary: { type: String },
  password: { type: String, required: true },
  address: { type: String, required: true },
  photo: { type: String },
  atLeastEighteen: { type: Boolean, required: true },
});

// Activity Schema
const activitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String },
});

// Venue Schema
const venueSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
});

// Skill Level Schema
const skillLevelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  displayOrder: { type: Number, min: 0, max: 9, required: true },
});


// Intensity Level Schema
const intensityLevelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  displayOrder: { type: Number, min: 0, max: 9, required: true },
});

// Event Schema
const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  sport: { type: mongoose.Schema.Types.ObjectId, ref: 'Activity', required: true },
  smallDescription: { type: String },
  description: { type: String },
  additionalInfo: { type: String },
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

// User Interested Activities Schema
const userInterestedActivitiesSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  activityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Activity', required: true },
  skillLevelId: { type: mongoose.Schema.Types.ObjectId, ref: 'SkillLevel', required: true },
});

const User = mongoose.model('User', userSchema);
const Activity = mongoose.model('Activity', activitySchema);
const Venue = mongoose.model('Venue', venueSchema);
const SkillLevel = mongoose.model('SkillLevel', skillLevelSchema);
const IntensityLevel = mongoose.model('IntensityLevel', intensityLevelSchema);
const Event = mongoose.model('Event', eventSchema);
const UserInterestedActivities = mongoose.model('UserInterestedActivities', userInterestedActivitiesSchema);

// Export models
module.exports = {
  connectDB,
  User,
  Activity,
  Venue,
  SkillLevel,
  IntensityLevel,
  Event,
  UserInterestedActivities,
};