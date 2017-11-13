const mongoose = require('mongoose');

module.exports = mongoose.model("User", new mongoose.Schema({
    email: String,
    password: String,
    firstname: String,
    lastname: String,
    token: String
}));