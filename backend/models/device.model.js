const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const deviceSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true,
    },
    dirs: {
        type: Array,
        default: [],
    },
    rootDir: {
        type: String,
        required: true,
    }
}, {
    timestamps: true, 
});

const Device = mongoose.model('Device', deviceSchema);

module.exports = Device;