const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema({
    street: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    zip: {
        type: String,
    },
    country: {
        type: String,
        required: true,
    },
    isPrimary: {
        type: Boolean,
        default: false,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
});

AddressSchema.set("toJSON", {
    virtuals: true,
});

module.exports = mongoose.model("Address", AddressSchema);
