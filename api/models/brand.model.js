const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const BrandSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    model: [{ name: String }],
});

const AccountModel = mongoose.model('brand', BrandSchema);
module.exports = AccountModel;