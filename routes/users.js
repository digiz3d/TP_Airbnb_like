var express = require('express');
var router = express.Router();
var dbContext = require('../data/databaseManager.js');

/* GET users listing. */
router.get('/', function (req, res) {
    /* TODO delete passwords from the results */
    dbContext.getUsers().then((doc) => {
        res.send(doc);
    }).catch(() => {

    });
});

/* get user infos */
router.get('/:email', function (req, res) {
    dbContext.getUser(req.params.email).then(
        (doc) => {
            if (!doc) res.status(404).send("user not found");
            res.send(doc);
        }
    ).catch(
        () => {
            res.status(500).send("Fatal error.");
        });
});

router.get('/:userId/:key', function (req, res) {
    /* block the password retrieval */
    if (req.params.key === "password") {
        res.status(403).send("no no no you will not get it");
        return;
    }
    dbContext.getUser(req.params.userId).then((user) => {
        if (!user || !user[req.params.key]) {
            res.status(404).send("not found");
            return;
        }
        res.send(user[req.params.key]);
    }).catch(()=> {

    });

    /* if the user or the information we're looking for is not found, throw a 404 */
    
});

router.get('/:email/:key/:value', function (req, res) {
    dbContext.getUser(req.params.email).then((user) => {
        /* if the user or the information we're looking for is not found, throw a 404 */
        if (!user || !user[req.params.key]) {
            res.status(404).send("user not found");
            return;
        }

        dbContext.setUserInfo(req.params.email, req.params.key, req.params.value).then(() => {
            res.send('ok : ' + user[req.params.key]);
        }).catch(() => {
            res.send('pas ok : ' + user[req.params.key]);
        });
        
    }).catch(() => {
        res.status(500).send("nonononn");
    })

    
});

router.get('/create/:email/:password/:firstname/:lastname', function (req, res) {
    dbContext.createUser(req.params.email, req.params.password, req.params.firstname, req.params.lastname);
    res.send("New user registered.");
})
module.exports = router;
