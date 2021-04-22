const express = require('express');
const router = express.Router();
const {
    createUser,
    deleteUser,
    loginUser,
} = require('../controllers/UsersController');

//Create user
router.post('/signup', createUser);

//Delete user
router.delete('/:id', deleteUser);

module.exports = router;
