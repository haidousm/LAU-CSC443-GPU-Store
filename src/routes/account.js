const express = require("express");
const router = express.Router();

/**
 * @route GET /account
 * @desc Render account page
 * @access Public
 */
router.get("/", (req, res) => {
    res.render("pages/account", { user: req.user });
});

module.exports = router;
