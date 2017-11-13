const mongoose = require('mongoose');

module.exports = mongoose.model("Apartment", new mongoose.Schema({
    name: String,
    description: String,
    city: String,
    price: Number,
    beds: Number,
    rooms: Number
}));