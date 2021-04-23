const express = require('express');
const router = express.Router();
const {
    createUser,
    deleteUser,
    loginUser,
    findUserById,
    updateUserById,
} = require('../controllers/UsersController');

//Find user by id
router.get('/userProfile/:id', findUserById);

//Update user by id
router.put('/updateUserProfile/:id', updateUserById);

//Create user
router.post('/signup', createUser);

//Login user
router.post('/login', loginUser);

//Delete user
router.delete('/:id', deleteUser);

module.exports = router;
