const express = require('express');
const router = express.Router();
const skillLevelController = require('../controllers/skillLevelController');

router.get('/', skillLevelController.getSkillLevels);

module.exports = router;
