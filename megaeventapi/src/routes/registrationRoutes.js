const express = require('express');
const RegistrationController = require('../controllers/RegistrationController');

const router = express.Router();

router.post('/', RegistrationController.createRegistration);
router.get('/', RegistrationController.getRegistrations);
router.delete('/', RegistrationController.deleteRegistration);

module.exports = router;