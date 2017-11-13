const express = require('express');
const router = express.Router();
const Apartment = require('../app/models/apartment');

router.get('/', function (req, res) {
    Apartment.find({}, function (err, apts) {
        res.json(apts);
    });
});

router.get('/:city', function (req, res) {
    Apartment.find({city: req.params.city}, function (err, apts) {
        res.json(apts);
    });
});

router.get('/:city/:startDate/:endDate', function (req, res) {

    if (Date.parse(req.params.startDate) > Date.parse(req.params.endDate)) {
        res.status(400).json({error: true, message:"Start date must be inferior or equal to end date"});
    }

    //req.params.startDate
    //req.params.endDate
    Apartment.find({city: city}, function (err, apts) {
        res.json(apts);
    });
});

module.exports = router;