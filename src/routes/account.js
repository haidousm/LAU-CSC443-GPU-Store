const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Address = require("../models/Address");

/**
 * @route GET /account
 * @desc Render account page
 * @access Public
 */
router.get("/", async (req, res) => {
    const user = await User.findById(req.user._id).populate("addresses");
    res.render("pages/account", {
        user: user,
    });
});

/**
 * @route POST /account/addresses
 * @desc Add address to user
 * @access Public
 */
router.post("/addresses", async (req, res) => {
    const address = new Address({
        user: req.user.id,
        street: req.body.street,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        isPrimary: req.body.isPrimary,
    });

    await address.save();

    req.user.addresses.push(address);
    await req.user.save();
    res.send(address);
});

module.exports = router;
