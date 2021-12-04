const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        },
    ],
    total: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ["pending", "completed", "cancelled"],
        default: "pending",
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Order", OrderSchema);
