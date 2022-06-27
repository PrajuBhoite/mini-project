const { type } = require("express/lib/response");
const mongoose = require("mongoose");

const schoolsSchema = new mongoose.Schema({
    schoolname: { type: String, require: true },
    userId: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
    tagline: { type: String, require: true },
    mobile: { type: String , require: true },
    address: { type: String,require: true },
    city: {type: String ,require: true },
    pincode:{type: String, require: true} ,
    createdAt: { type: Date, defalut: new Date() },
    modifiedAt: { type: Date, defalut: new Date() },
    isDeleted: { type: Boolean, defalut: false },
    deletedAt: { type: Date, defalut: null },
},
    { timestamps: true }
);

module.exports = mongoose.model("Schools", schoolsSchema);