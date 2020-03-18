const mongoose = require('mongoose')
require('./model.model')

const Schema = mongoose.Schema;

const BrandSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    models: [{
        type: Schema.Types.ObjectId,
        ref: 'Model'
    }],
});

const BrandModel = mongoose.model('Brand', BrandSchema);

module.exports = BrandModel;