
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const accountSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    rootDir: {
        type: String,
        default: '/' , 
    }
}, {
    timestamps: true, 
});

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;