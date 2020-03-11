const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const ROLEs = require('../config/config').ROLEs;

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    avatar: String,
    userName: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        min: 8,
        select: false,
        required: true
    },
    role: {
        type: String,
        enum: ROLEs
    },
    singUpDate: { type: Date, default: Date.now() },
    emailConfirmed: { type: String, default: uuidv4() },
    lastLogin: Date,

    // accounts: [{ type: Schema.ObjectId, ref: Account }]
});

UserSchema.pre('save', async function (next) {
    const user = this;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password, salt);
    user.password = hash;
    next();
});

UserSchema.methods.isValidPassword = async function (password) {
    const user = this;
    const compare = await bcrypt.compare(password, user.password);
    return compare;
}

const UserModel = mongoose.model('user', UserSchema);
module.exports = UserModel;