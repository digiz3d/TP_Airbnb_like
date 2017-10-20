var express = require('express');
var router = express.Router();
var dbContext = require('../data/databaseManager.js');
var mailer = require('../mailer.js');

/* GET mails */
router.get('/', function(req, res) {
    res.send("we send emails from here");
});

router.post('/send/:to/:subject/:message', function(req, res) {
    var transport = mailer.getMailer()
    transport.sendMail(mailer.getMessage(req.params.to, req.params.subject, req.params.message), function(error, info){
        if(error){
            res.status(500);
            res.send("rip : "+error);
        }
        else {
            res.send("mail send to "+req.params.to);
        }
    });
});
module.exports = router;
