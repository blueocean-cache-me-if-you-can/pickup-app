const express = require('express');
const router = express.Router();
const intensityController = require('../controllers/intensityLevelController');

router.get('/', intensityController.getIntensityLevels);

module.exports = router;
