const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Address = require("../models/Address");
const Order = require("../models/Order");

/**
 * @route GET /account
 * @desc Render account page
 * @access Public
 */
router.get("/", async (req, res) => {
    let user;
    let orderHistory = [];
    if (req.user) {
        user = await User.findById(req.user._id).populate("addresses");
        orderHistory = await Order.find({ user: req.user._id }).populate(
            "products.product"
        );
    }

    res.render("pages/account", {
        user: user,
        orderHistory: orderHistory,
    });
});

/**
 * @route POST /account/addresses
 * @desc Add address to user
 * @access Private
 */
router.post("/addresses", async (req, res) => {
    if (req.body.id) {
        const address = await Address.findById(req.body.id);
        address.street = req.body.street;
        address.city = req.body.city;
        address.zip = req.body.zip;
        address.country = req.body.country;
        address.isPrimary = req.body.isPrimary;
        await address.save();
        console.log(req.body.id);
        return res.send(address);
    }

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

/**
 * @route GET /account/addresses/:id
 * @desc Get address by id
 * @access Private
 */

router.get("/addresses/:id", async (req, res) => {
    const address = await Address.findById(req.params.id);
    res.send(address);
});

/**
 * @route DELETE /account/addresses/:id
 * @desc Delete address from user
 * @access Private
 */

router.delete("/addresses/:id", async (req, res) => {
    const address = await Address.findById(req.params.id);
    await address.remove();
    req.user.addresses.pull(address);
    await req.user.save();
    res.send(address);
});

/**
 * @route GET /account/order-details/:id
 * @desc Get order details by id
 * @access Private
 */

router.get("/order-details/:id", async (req, res) => {
    if (!req.user) {
        return res.redirect("/account");
    }
    const order = await Order.findById(req.params.id).populate({
        path: "products.product",
        model: "Product",
        populate: { path: "brand", model: "Brand" },
    });
    res.render("pages/order-details", { order: order });
});

module.exports = router;
