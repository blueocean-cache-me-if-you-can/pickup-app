const express = require('express');
const router = express.Router();
const venueController = require('../controllers/venueController');

router.get('/', venueController.getVenues);
router.post('/', venueController.createVenue);

module.exports = router;
