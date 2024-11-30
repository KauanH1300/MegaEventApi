const express = require('express');
const UserController = require('../controllers/UserController');

const router = express.Router();
router.post('/', UserController.createUser );
router.get('/', UserController.getUsers);
router.put('/:id', UserController.updateUser );
router.delete('/', UserController.deleteUser );
router.get('/search', UserController.getUserByEmailOrId); 
router.get('/:user_id/events', UserController.getUserEvents); 

module.exports = router;