const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model.js');
const authConfig = require('../../config/auth.config.js');

// Register a new user
exports.signup = (req, res) => {
    if (!req.body || !req.body.email || !req.body.password) {
        return res.status(400).send({
            message: "Email and password are required."
        });
    }

    bcrypt.hash(req.body.password, 10)
    .then(hashedPassword => {
        const user = new User({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            phone: req.body.phone,
            password: hashedPassword
        });

        return user.save();
    })
    .then(data => {
        const { password, ...userWithoutPassword } = data.toObject();
        res.send(userWithoutPassword);
    })
    .catch(err => {
        if (err.code === 11000) {
            return res.status(409).send({
                message: "Email is already registered."
            });
        }
        res.status(500).send({
            message: err.message || "Something went wrong while registering the user."
        });
    });
};

// Authenticate a user and issue a JWT
exports.signin = (req, res) => {
    if (!req.body || !req.body.email || !req.body.password) {
        return res.status(400).send({
            message: "Email and password are required."
        });
    }

    User.findOne({ email: req.body.email })
    .then(user => {
        if (!user) {
            return res.status(404).send({
                message: "User not found."
            });
        }

        bcrypt.compare(req.body.password, user.password)
        .then(isMatch => {
            if (!isMatch) {
                return res.status(401).send({
                    message: "Invalid password."
                });
            }

            const token = jwt.sign({ id: user._id }, authConfig.secret, {
                expiresIn: authConfig.expiresIn
            });

            res.send({
                id: user._id,
                email: user.email,
                accessToken: token
            });
        });
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || "Something went wrong while signing in."
        });
    });
};
