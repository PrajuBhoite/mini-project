const { type } = require("express/lib/response");
const mongoose = require("mongoose");

const schoolsSchema = new mongoose.Schema({
    name: { type: String, require: true },
    userId: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
    tagline: { type: String, require: true },
    mobile: { type: String , require: true },
    address: {
        street: { type: String },
        city: String,
        pincode: Number
    },
    createdAt: { type: Date, defalut: new Date() },
    modifiedAt: { type: Date, defalut: new Date() },
    isDeleted: { type: Boolean, defalut: false },
    deletedAt: { type: Date, defalut: null },
},
    { timestamps: true }
);

module.exports = mongoose.model("Schools", schoolsSchema);