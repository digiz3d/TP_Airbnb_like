const express = require('express');
const router = express.Router();
const mailer = require('../mailer.js');


router.get('/', function(req, res) {
    res.send("we send emails from here");
});

router.get('/send/:to/:subject/:message', function(req, res) {
    mailer.send(req.params.to, req.params.subject, req.params.message);
});
module.exports = router;
