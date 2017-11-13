const io = require('../io');
const express = require('express');
const router = express.Router();

router.get('/',function(req, res) {
    res.render('messages');
});

router.post('/', function(req, res){
    io.sendMessage(req.body.text);
    res.send('ok');
});
module.exports = router;
