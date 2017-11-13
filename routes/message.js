const io = require('../io');
const express = require('express');
const router = express.Router();

router.get('/',function(req, res) {
    res.render('messages');
});

router.post('/:message', function(req, res){
    io.sendMessage(req.params.message);
    res.send('ok');
});
module.exports = router;
