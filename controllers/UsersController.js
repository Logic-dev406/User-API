const User = require('../models/user');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

class UserController {
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
