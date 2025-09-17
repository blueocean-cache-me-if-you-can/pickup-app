const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  activityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Activity', required: true },
  skillLevelId: { type: mongoose.Schema.Types.ObjectId, ref: 'SkillLevel', required: true },
}, { _id: false });

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
  activities: [activitySchema],
});

const User = mongoose.model('User', userSchema);

module.exports = User;



// // Read user by ID
// async function getUserById(userId) {
//   return await User.findById(userId).exec();
// }

// // Create new user
// async function createUser(userData) {
//   const user = new User(userData);
//   return await user.save();
// }

// // Update user by ID, including embedded activities
// async function updateUser(userId, updateData) {
//   // If activities is present in updateData, replace the entire array
//   if (updateData.activities) {
//     return await User.findByIdAndUpdate(
//       userId,
//       {
//         $set: {
//           ...updateData,
//           activities: updateData.activities
//         }
//       },
//       { new: true }
//     ).exec();
//   } else {
//     return await User.findByIdAndUpdate(userId, updateData, { new: true }).exec();
//   }
// }

// module.exports.getUserById = getUserById;
// module.exports.createUser = createUser;
// module.exports.updateUser = updateUser;