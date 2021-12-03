const express = require("express");
const passport = require("passport");

const router = express.Router();

const { generateSalt, generateHash } = require("../utils/password");
const User = require("../models/User");

/**
 * @route POST /auth/login
 * @desc Login user
 * @access Public
 */

router.post("/login", passport.authenticate("local"), (req, res) => {
    if (req.user) {
        res.send(req.user);
    } else {
        res.status(401).json({
            message: "Invalid credentials",
        });
    }
});

/**
 * @route POST /auth/register
 * @desc Register a new user
 * @access Public
 */
router.post("/register", async (req, res) => {
    const salt = generateSalt();
    const hash = generateHash(req.body.password, salt);
    const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        hash: hash,
        salt: salt,
        role: req.body.role,
    });
    await user.save();
    req.login(user, (err) => {
        if (err) {
            res.status(500).json({
                message: "Error while registering",
            });
        } else {
            res.send(user);
        }
    });
});

module.exports = router;
