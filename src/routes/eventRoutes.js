const express = require('express');
const EventController = require('../controllers/EventController');

const router = express.Router();

router.post('/', EventController.createEvent);
router.get('/', EventController.getEvents);
router.put('/:id', EventController.updateEvent); 
router.delete('/:id', EventController.deleteEvent); 

module.exports = router;