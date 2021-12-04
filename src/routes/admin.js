const express = require("express");
const router = express.Router();

const Order = require("../models/Order");
const Product = require("../models/Product");

/**
 * @route GET /admin
 * @desc Render admin page
 * @access Private
 */
router.get("/", async (req, res) => {
    if (!req.user || req.user.role !== "admin") {
        res.redirect("/account");
    }

    const orders = await Order.find({})
        .populate("user")
        .populate("products.product");

    const products = await Product.find({}).populate("brand");
    res.render("pages/admin", { orders, products });
});

module.exports = router;
