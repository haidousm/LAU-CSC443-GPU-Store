const express = require("express");
const router = express.Router();

const Cart = require("../models/Cart");
const User = require("../models/User");
const Product = require("../models/Product");

/**
 * @route GET /cart
 * @desc Get cart for current user
 * @access Private
 */
router.get("/", async (req, res) => {
    if (!req.user) return res.redirect("/account");
    let cart = await Cart.findOne({ user: req.user._id })
        .populate("user")
        .populate({
            path: "products.product",
            model: "Product",
            populate: { path: "brand", model: "Brand" },
        });
    const user = await User.findById(req.user._id).populate("addresses");
    if (!cart) {
        cart = new Cart({
            user: user,
            products: [],
            total: 0,
        });
    }
    res.render("pages/cart", { user: user, cart });
});

/**
 * @route POST /cart/:id
 * @desc Add product to cart
 * @access Private
 */
router.post("/:id", async (req, res) => {
    if (!req.user) return res.status(401).send("Unauthorized");
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        cart = new Cart({
            user: req.user._id,
            products: [],
            total: 0,
        });
    }
    const product = await Product.findById(req.params.id);
    const productInCart = cart.products.find(
        (productInCart) => productInCart.product.toString() === req.params.id
    );
    if (productInCart) {
        productInCart.quantity += 1;
    } else {
        cart.products.push({
            product: req.params.id,
            quantity: 1,
        });
    }
    cart.total = cart.total + product.price;
    await cart.save();
    res.json({ success: true });
});

/**
 * @route DELETE /cart/:id
 * @desc Delete product to cart
 * @access Private
 */
router.delete("/:id", async (req, res) => {
    if (!req.user) return res.status(401).send("Unauthorized");
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        res.status(404).json({ success: false });
    }
    const product = await Product.findById(req.params.id);
    const productInCart = cart.products.find(
        (productInCart) => productInCart.product.toString() === req.params.id
    );
    if (productInCart) {
        cart.total = cart.total - productInCart.quantity * product.price;
        cart.products.pull(productInCart);
    } else {
        res.status(404).json({ success: false });
    }

    await cart.save();
    res.json({ success: true });
});

module.exports = router;
