const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

/**
 * @route GET /order
 * @desc Get all orders
 * @access Private
 */
router.get("/", async (req, res) => {
    if (!(req.user.role === "admin")) {
        res.redirect("/account");
    }
    const orders = await Order.find();
    res.send(orders);
});

/**
 * @route POST /order
 * @desc Create an order
 * @access Private
 */
router.post("/", async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        return res.status(400).send("Cart is empty");
    }

    cart.products.forEach(async (productCartObj) => {
        const product = await Product.findById(productCartObj.product);
        if (!product) {
            return res.status(400).send("Product not found");
        }
        if (product.stock < productCartObj.quantity) {
            return res.status(400).send("Product out of stock");
        }
        product.stock -= productCartObj.quantity;
        await product.save();
    });

    const order = new Order({
        products: cart.products,
        total: cart.total,
        address: req.body.addressId,
        user: req.user._id,
    });
    await order.save();
    await cart.remove();
    res.send(order);
});

/**
 * @route PUT /order/:id
 * @desc Update an order
 * @access Private
 */
router.put("/:id", async (req, res) => {
    if (!(req.user.role === "admin")) {
        res.redirect("/account");
    }
    const order = await Order.findById(req.params.id);
    order.status = req.body.status;
    await order.save();
    res.send(order);
});

module.exports = router;
