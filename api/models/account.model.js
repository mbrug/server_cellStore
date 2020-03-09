const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const AccountSchema = new Schema({
    accountNumbre: {
        type: Number,
        required: true
    }
});

const AccountModel = mongoose.model('account', AccountSchema);
module.exports = AccountModel;