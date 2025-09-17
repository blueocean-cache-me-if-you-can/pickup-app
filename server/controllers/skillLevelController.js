const skillLevel = require('../models/skillLevel');

exports.getSkillLevels = async (req, res) => {
  console.log('getSkillLevels called');
  try {
    const skillLevels = await skillLevel.find();
    console.log(skillLevels);
    res.status(200).json(skillLevels);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch skill levels', details: err.message });
  }
};
