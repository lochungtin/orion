const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const accountSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    rootDir: {
        type: String,
        required: true,
    },
}, {
    timestamps: true, 
});

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;