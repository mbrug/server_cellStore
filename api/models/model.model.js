const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const ModelSchema = new Schema({
    name: {
        type: String,
        required: true
    },
});

const ModelModel = mongoose.model('Model', ModelSchema);

module.exports = ModelModel;