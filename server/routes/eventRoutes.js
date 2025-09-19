const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// GET /events - fetch all events
router.get('/', eventController.getEvents);
router.post('/', eventController.createEvent);
router.patch('/:id', eventController.updateEvent);

module.exports = router;
