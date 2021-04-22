const express = require('express');
const router = express.Router();
const {
    createUser,
    deleteUser,
    loginUser,
} = require('../controllers/UsersController');

//Create user
router.post('/signup', createUser);

//Login user
router.post('/login', loginUser);

//Delete user
router.delete('/:id', deleteUser);

module.exports = router;
