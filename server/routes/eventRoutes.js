const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// Search events
router.post('/search', eventController.getEvents);

router.get('/:id', eventController.getEventById);
router.patch('/:id', eventController.updateEvent);
router.delete('/:id', eventController.deleteEvent);
router.put('/:id/player', eventController.updateEventPlayer);
router.post('/', eventController.createEvent);

module.exports = router;
