const express = require('express');
const router = express.Router();
const {
    createUser,
    deleteUser,
    loginUser,
    findUserById,
} = require('../controllers/UsersController');

//Find user by id
router.get('/userProfile/:id', findUserById);

//Create user
router.post('/signup', createUser);

//Login user
router.post('/login', loginUser);

//Delete user
router.delete('/:id', deleteUser);

module.exports = router;
