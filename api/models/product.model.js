const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    brand: {
        type: String,
    },
    model: {
        type: String,
    },
    screen: {
        type: mongoose.Schema.Types.Decimal128,
    },
    price: {
        type: Number,
    },
    camera: {
        type: Number,
    },
    storage: {
        type: Number,
    },
    memory: {
        type: Number,
    },
    battery: {
        type: Number,
    },
    image: {
        type: String,
    },
    dualSim: {
        type: Boolean,
    },
    owner: {
        type: String,
    },
});

const ProductModel = mongoose.model('product', ProductSchema);
module.exports = ProductModel;