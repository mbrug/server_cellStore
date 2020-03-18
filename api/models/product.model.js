const mongoose = require('mongoose')
require('./brand.model')


const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    brand: {
        type: Schema.Types.ObjectId,
        ref: 'Brand'
    },
    model: {
        type: Schema.Types.ObjectId,
        ref: 'Model'
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