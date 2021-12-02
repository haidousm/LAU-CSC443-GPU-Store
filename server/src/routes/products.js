const express = require("express");
const router = express.Router();

const Product = require("../models/Product");

/**
 * @route GET /products
 * @desc Get all products
 * @param num - number of products to return (default: 10) | search - search term | sort - sort by price (asc/desc)
 * @access Public
 */
router.get("/", async (req, res) => {
    const { num, search, sort } = req.query;
    const limit = num ? parseInt(num) : 10;
    const searchTerm = search ? search : "";
    const query = searchTerm
        ? { name: { $regex: searchTerm, $options: "i" } }
        : {};
    const sortBy = sort ? sort : "asc";

    const products = await Product.find(query)
        .limit(limit)
        .sort({ price: sortBy });
    res.send(products);
});

module.exports = router;
