const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const reportSchema = new Schema({
    timestamp: {
        type: String,
        unique: true,
        required: true,
    },
    connections: {
        type: Number,
        required: true,
    },
    transfers: {
        type: Object,
        required: true,
    }
}, {
    timestamps: true, 
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;