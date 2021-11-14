const express = require("express");
const router = express.Router();

// @desc Get all products
// @route GET /products/
app.get("/products", (req, res) => {
    let products = ["GPU 1", "GPU 2", "GPU 3"];
    res.json(products);
});
