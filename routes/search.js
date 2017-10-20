var express = require('express');
var router = express.Router();
var dbContext = require('../data/databaseManager.js');

/* GET search results. */
router.get('/', function (req, res, next) {
    let city = req.params.location;
    res.type('application/json');
    res.send(dbContext.getHouses(
        null,
        req.query.beds,
        req.query.priceMin,
        req.query.priceMax));
});

router.get('/:location', function (req, res, next) {
    res.type('application/json');
    res.send(dbContext.getHouses(
        req.params.location, 
        req.query.beds,
        req.query.priceMin,
        req.query.priceMax));
});

router.get('/:location/:startDate/:endDate', function (req, res, next) {
    let city = req.params.location;
    res.type('application/json');
    if (Date.parse(req.params.startDate) > Date.parse(req.params.endDate))
        res.send("Start date must be inferior or equal to end date");
    res.send(dbContext.getHouses(
        city, 
        req.query.beds,
        req.query.priceMin,
        req.query.priceMax,
        req.params.startDate,
        req.params.endDate));
});

module.exports = router;