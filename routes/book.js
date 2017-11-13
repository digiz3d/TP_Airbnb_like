const express = require('express');
const router = express.Router();
const mailer = require('../mailer.js');
const Booking = require('../app/models/booking');
const Apartment = require('../app/models/apartment');

router.get('/', function (req, res) {
    Booking.find({}, function (err, bkg) {
        res.json(bkg);
    });
});

//Return all booking for an apartment
router.get('/:id', function (req, res) {
    Apartment.findOne({ _id: req.params.id }, function (err, appart) {
        if (err) throw err;

        if (appart) {
            Booking.find({ apartment: appart._id }, function (err2, boo) {
                res.json(boo);
            });
        }
        else {
            res.json({ success: false });
        }
    });
});

//lets book an apartment
router.post('/:id/:startDate/:endDate', function(req, res) {
    Apartment.findOne({ _id: req.params.id }, function (err, appart) {
        if (err) throw err;

        if (appart) {
            // TODO : ICI VWALA
            Booking.find({
                apartment: appart._id,
                start: { $gt: new Date(2014,1,10) }
            }, function(err, books) {
                res.json(books);
            });
        }
        else {
            res.json({ success: false });
        }
    });

    
});

module.exports = router;
