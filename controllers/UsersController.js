const User = require('../models/user');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { secret } = require('../config/config');
const response = require('../helpers/response');

class UserController {
    static async getListOfAllUsers(req, res) {
        try {
            const userList = await User.find().select('-password');

            if (!userList) {
                res.status(500).send(response('No user find', {}, false));
            }

            return res
                .status(200)
                .send(response('Fetchted users successfully', userList));
        } catch (error) {
            return res.status(400).send(response(error.message, {}, false));
            console.log(response(error.message, {}, false));
        }
    }

    static async findUserById(req, res) {
        try {
            if (!mongoose.isValidObjectId(req.params.id)) {
                res.status(400).send(response('Invalid User id', {}, false));
            }

            const user = await User.findById(req.params.id).select('-password');

            if (!user) {
                return res
                    .status(500)
                    .send(response('User not found', {}, false));
            }

            res.status(200).send(response('Fetched user successful', user));
        } catch (error) {
            res.send(response(error.message, {}, false));
            console.log(response(error.message, {}, false));
        }
    }

    static async updateUserById(req, res) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            res.status(400).send(response('Invalid User id', {}, false));
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
            },
            { new: true }
        ).select('-password');

        if (!user)
            return res
                .status(500)
                .send(response('The user can not be updated', {}, false));

        res.send(response('Updated user successfully', user));
    }

    static async createUser(req, res) {
        try {
            const userExist = await User.findOne({ email: req.body.email });

            if (userExist) {
                return res
                    .status(400)
                    .send(response('Email already exist', {}, false));
            }

            let user = new User({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, 10),
            });
            user = await user.save();
            if (!user)
                return res
                    .status(500)
                    .send(response('The user can not be created', {}, false));
            res.send(response('Created user successfully', user));
        } catch (error) {
            res.send(response(error.message, {}, false));
            console.log(response(error.message, {}, false));
        }
    }

    static async loginUser(req, res) {
        try {
            const user = await User.findOne({ email: req.body.email });

            if (!user) {
                return res
                    .status(400)
                    .send(response('User not found', {}, false));
            }

            if (user && bcrypt.compareSync(req.body.password, user.password)) {
                const token = jwt.sign(
                    {
                        userId: user.id,
                    },
                    secret,
                    { expiresIn: '5h' }
                );

                return res.status(200).send(
                    response('Login successful', {
                        user: user.email,
                        token: token,
                    })
                );
            } else {
                res.status(400).send(response('Incorrect password', {}, false));
            }

            return res.status(200).send(response(user));
        } catch (error) {
            res.send(response(error.message, {}, false));
            console.log(response(error.message, {}, false));
        }
    }

    static deleteUser(req, res) {
        try {
            if (!mongoose.isValidObjectId(req.params.id)) {
                res.status(400).send(response('Invalid User id', {}, false));
            }

            User.findByIdAndDelete(req.params.id)
                .then((user) => {
                    if (user) {
                        return res
                            .status(200)
                            .send(response('User deleted', {}));
                    } else {
                        return res
                            .status(404)
                            .send(response('User not found', {}, false));
                    }
                })
                .catch((error) => {
                    return res
                        .status(400)
                        .send(response(error.message, {}, false));
                });
        } catch (error) {
            res.send(response(error.message, {}, false));
            console.log(response(error.message, {}, false));
        }
    }
}

module.exports = UserController;
