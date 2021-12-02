const express = require("express");
const router = express.Router();

const Product = require("../models/Product");
const Brand = require("../models/Brand");

/**
 * @route GET /products
 * @desc Get all products
 * @param num - number of products to return (default: 10) | search - search term | sort - sort by price (asc/desc)
 * @access Public
 */
router.get("/", async (req, res) => {
    const { num, search, sort, brand } = req.query;
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

/**
 * @route GET /products/:brand
 * @desc Get all products by brand
 * @param num - number of products to return (default: 10) | search - search term | sort - sort by price (asc/desc)
 * @access Public
 */
router.get("/:brand", async (req, res) => {
    const { num, search, sort } = req.query;
    const limit = num ? parseInt(num) : 10;
    const searchTerm = search ? search : "";
    const query = searchTerm
        ? { name: { $regex: searchTerm, $options: "i" } }
        : {};
    const sortBy = sort ? sort : "asc";
    const brand = req.params.brand;

    const brandObj = await Brand.findOne({ name: brand });
    if (!brandObj) return res.status(404).send("Brand not found");

    const products = await Product.find({ brand: brandObj._id, ...query })
        .limit(limit)
        .sort({ price: sortBy });
    res.send(products);
});

/**
 * @route POST /products
 * @desc Create a product
 * @access Private
 */
router.post("/", async (req, res) => {
    const { name, description, image, stock, price, brand } = req.body;
    const brandObj = await Brand.findOne({ name: brand });
    if (!brandObj) return res.status(404).send("Brand not found");

    const newProduct = new Product({
        name,
        description,
        image,
        stock,
        price,
        brand: brandObj._id,
    });
    await newProduct.save();
    res.send(newProduct);
});

module.exports = router;
