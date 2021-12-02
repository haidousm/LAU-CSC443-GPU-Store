const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    hash: {
        type: String,
        required: true,
    },
    salt: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    addresses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Address",
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

UserSchema.set("toJSON", {
    virtuals: true,
});

module.exports = mongoose.model("User", UserSchema);
