var express = require('express');
var router = express.Router();
var dbContext = require('../data/databaseManager.js');

/* GET users listing. */
router.get('/', function(req, res) {
    /* TODO delete passwords from the results */
    res.contentType("application/json")
    res.send(dbContext.getUsers());
});

/* get user infos */
router.get('/:userId', function(req, res) {
    res.send(dbContext.getUserNoPassword(req.params.userId));
});

router.get('/:userId/:what', function(req, res) {
    /* block the password retrieval */
    if (req.params.what === "password") {
        res.status(403).send("no no no you will not get it");
        return;
    }
    let user = dbContext.getUser(req.params.userId);

    /* if the user or the information we're looking for is not found, throw a 404 */
    if (!user || !user[req.params.what]) {
        res.status(404).send("not found");
        return;
    }
    res.send(user[req.params.what]);
});

router.patch('/:userId/:what', function(req, res) {
    /* block the password change */
    if (req.params.what === "password") {
        res.status(403).send("no no no you will not change the password");
        return;
    }
    let user = dbContext.getUser(req.params.userId);

    /* if the user or the information we're looking for is not found, throw a 404 */
    if (!user || !user[req.params.what]) {
        res.status(404).send("not found");
        return;
    }
    /* check that the value is set in the request's body */
    if (!req.body.value) {
        res.status(400).send("set a value");
        return;
    }
    
    dbContext.setUserInfo(req.params.userId, req.params.what, req.body.value);
    res.send('ok : ' + user[req.params.what]);
});

module.exports = router;
