const express = require('express');
const router = express.Router();
const mailer = require('../mailer.js');


router.get('/', function(req, res) {
    res.send("we send emails from here");
});

router.post('/', function(req, res) {
    mailer.send(req.body.to, req.body.subject, req.body.message);
    res.send({success: true});
});
module.exports = router;
