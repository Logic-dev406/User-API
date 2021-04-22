const User = require('../models/user');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { secret } = require('../config/config');

class UserController {
    static async findUserById(req, res) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            res.status(400).send('Invalid User id');
        }

        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return res.status(500).json({
                success: false,
                message: 'User not found',
            });
        }

        res.status(200).send(user);
    }

    static async createUser(req, res) {
        const userExist = await User.findOne({ email: req.body.email });

        if (userExist) {
            return res
                .status(400)
                .json({ success: false, message: 'Email already exist' });
        } else {
            let user = new User({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, 10),
            });
            user = await user.save();
            if (!user)
                return res.status(500).send('The user can not be created');
            res.send(user);
        }
    }

    static async loginUser(req, res) {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(400).send('User not found');
        }

        if (user && bcrypt.compareSync(req.body.password, user.password)) {
            const token = jwt.sign(
                {
                    userId: user.id,
                },
                secret,
                { expiresIn: '1d' }
            );

            return res.status(200).send({ user: user.email, token: token });
        } else {
            res.status(400).send({
                success: true,
                message: 'Incorrect password',
            });
        }

        return res.status(200).send(user);
    }

    static deleteUser(req, res) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            res.status(400).send('Invalid User id');
        }

        User.findByIdAndDelete(req.params.id)
            .then((user) => {
                if (user) {
                    return res.status(200).json({
                        success: true,
                        message: 'User deleted',
                    });
                } else {
                    return res.status(404).json({
                        success: false,
                        message: 'User not found',
                    });
                }
            })
            .catch((e) => {
                return res.status(400).send({ success: false, error: e });
            });
    }
}

module.exports = UserController;
