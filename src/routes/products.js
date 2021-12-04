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
        .sort({ price: sortBy })
        .populate("brand");
    res.send(products);
});

/**
 * @route POST /products
 * @desc Create a product
 * @access Private
 */
router.post("/", async (req, res) => {
    const product = new Product({
        name: req.body.name,
        price: req.body.price,
        brand: req.body.brand,
        image: req.body.image,
        description: req.body.description,
        stock: req.body.stock,
    });

    await product.save();
    res.send(product);
});

/**
 * @route GET /products/delete/:id
 * @desc Delete a product
 * @access Private
 */

router.get("/delete/:id", async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).send("Product not found");
    await product.remove();
    res.redirect("/admin");
});

/**
 * @route GET /products/brands
 * @desc Get all brands
 * @access Public
 */
router.get("/brands", async (req, res) => {
    const brands = await Brand.find();
    res.send(brands);
});

/**
 * @route GET /products/:id
 * @desc Render a product by id
 * @param id - product id
 * @access Public
 */

router.get("/:id", async (req, res) => {
    const product = await Product.findById(req.params.id).populate("brand");
    const similarProducts = (
        await Product.find({
            brand: product.brand._id,
        })
            .populate("brand")
            .limit(3)
    ).filter((p) => p.id !== product.id);

    return res.render("pages/product", { product, similarProducts });
});

/**
 * @route GET /products/brand/:brand
 * @desc Get all products by brand
 * @param num - number of products to return (default: 10) | search - search term | sort - sort by price (asc/desc)
 * @access Public
 */
router.get("/brand/:brand", async (req, res) => {
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
        .sort({ price: sortBy })
        .populate("brand");
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
