const express = require('express');
const router = express.Router();
const User = require('../app/models/user');

router.get('/', function (req, res) {
    User.find({}, function(err, usrs) {
        res.json(usrs);
    });
});

router.get('/:email', function (req, res) {
    User.findOne({'email': req.params.email}, function(err, usr) {
        res.json(usr);
    });
});

module.exports = router;
