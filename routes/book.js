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
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'An error occured'
            });
        }

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
router.post('/', function(req, res) {
    Apartment.findOne({ _id: req.body.apartment }, function (err, appart) {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'An error occured'
            });
        }

        if (appart) {
            // TODO : ICI VWALA
            
            Booking.find({
                apartment: appart._id,
                $or : [{
                    start : {$lt : req.params.start},
                    end: {$lt: req.params.start}
                },
                {
                    start: {$gt : req.params.end},
                    end: {$gt: req.params.end}
                }]
            }, function(err2, books) {
                if (err2) {
                    return res.status(500).json({
                        success: false,
                        message: 'An error occured !!!'
                    });
                }
                res.json(books);
                /*
                if (books.length === 0) {
                    let booking = new Booking({
                        start: req.body.start,
                        end: req.body.end,
                        apartment: appart._id,
                        user: req.decoded.id
                    });
                    booking.save(function(err3) {
                        if (err3) {
                            return res.status(500).json({
                                success: false,
                                message: 'An error occured'
                            });
                        }
                        res.json({
                            success: true,
                            message: 'You just booked this place.'
                        });
                    });
                }
                else {
                    res.status(409).json({
                        success: false,
                        message: 'Already booked at this date.'
                    });
                }
                */
            });
        }
        else {
            res.status(404).json({
                success: false,
                message: 'Apartment not found.'
            });
        }
    });

    
});

module.exports = router;
