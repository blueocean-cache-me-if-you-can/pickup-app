const intensityLevel = require('../models/intensityLevel');

exports.getIntensityLevels = async (req, res) => {
  try {
    const intensityLevels = await intensityLevel.find();
    res.status(200).json(intensityLevels);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch intensity levels', details: err.message });
  }
};
