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

//Return all booking for an appartment
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

    /*
    if (dbContext.getHouseById(req.params.id) != null) {
        if (!dbContext.isHouseBooked(req.params.id, req.params.startDate, req.params.endDate)) {
            dbContext.setHouseBooked(req.params.id, req.params.startDate, req.params.endDate)
            res.send("Housing booked :)");
            var transport = mailer.getMailer();
            transport.sendMail(mailer.getMessage("pintilie.c.a@gmail.com", "House booked !", "Congrats, you just booked the house n°" + 
            req.params.id + " from " + req.params.startDate + " to " + req.params.endDate), function(error, info){
                if(error){
                    res.status(500);
                    res.send("rip : "+error);
                }
                else {
                    res.send("mail send to "+req.params.to);
                }
            });
        } else {
            res.status(409);
            res.send("Housing already booked at this date. Change the dates and try again.");
        }
    } else {
        res.status(404);
        res.send("Housing not found");
    }
    */
});

module.exports = router;
