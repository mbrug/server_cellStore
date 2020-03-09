const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const RoleSchema = new Schema({
    name: {
        type: String,
        required: true
    }
});

const RoleModel = mongoose.model('user', RoleSchema);
module.exports = RoleModel;