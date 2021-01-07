

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const reportSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    success: {
        type: Boolean,
        required: true,
    },
    time: {
        type: Date,
        required: true,
    }   
}, {
    timestamps: true, 
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;