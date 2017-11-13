var express = require('express');
var router = express.Router();

router.get('/',function(req, res) {
    res.render('messages');
});

router.post('/:message', function(req, res){
    io.emit('message', req.params.message);
    res.send('ok');
});
module.exports = router;
