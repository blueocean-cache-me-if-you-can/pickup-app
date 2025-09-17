const activity = require('../models/activity');

exports.getActivities = async (req, res) => {
  console.log('getActivities called');
  try {
    const activities = await activity.find();
    console.log(activities);
    res.status(200).json(activities);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch activities', details: err.message });
  }
};
