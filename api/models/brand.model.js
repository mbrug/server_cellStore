const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const BrandSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    models: [{ name: String }],
});

const BrandModel = mongoose.model('brands', BrandSchema);
module.exports = BrandModel;