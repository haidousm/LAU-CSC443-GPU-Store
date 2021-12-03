const mongoose = require("mongoose");

const BrandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

BrandSchema.set("toJSON", {
    virtuals: true,
});

module.exports = mongoose.model("Brand", BrandSchema);
