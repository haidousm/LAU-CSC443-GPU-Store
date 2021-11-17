const express = require("express");
const router = express.Router();
const Product = require("../models/product");

// @desc Get all products
// @route GET /products/
router.get("/products", async (req, res) => {
    // get all products from mongoDB
    const products = await Product.find();
    res.json(products);
});

module.exports = router;
