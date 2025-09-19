const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

router.post('/get', eventController.getEvents);
router.get('/:id', eventController.getEventById);
router.patch('/:id', eventController.updateEvent);
router.delete('/:id', eventController.deleteEvent);
router.put('/:id/player', eventController.updateEventPlayer);
router.post('/', eventController.createEvent);
router.patch('/:id', eventController.updateEvent);

module.exports = router;
