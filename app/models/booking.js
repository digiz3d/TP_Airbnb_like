const mongoose = require('mongoose');

module.exports = mongoose.model("Booking", new mongoose.Schema({
    start: Date,
    end: Date,
    apartment: { type: mongoose.Schema.Types.ObjectId, ref: 'Apartment' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}));