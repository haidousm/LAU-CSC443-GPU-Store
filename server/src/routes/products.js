const express = require("express");
const router = express.Router();
const Product = require("../models/product");

// @desc Get all products
// @route GET /products/
router.get("/", async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

// @desc Create a product
// @route POST /products/
router.post("/", async (req, res) => {
    const product = new Product({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        image: req.body.image,
        quantity: req.body.quantity,
        brand: req.body.brand,
    });
    await product.save();
    res.json({
        message: "Product created successfully",
    });
});

module.exports = router;
