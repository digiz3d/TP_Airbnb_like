var express = require('express');
var router = express.Router();
var dbContext = require('../data/databaseManager.js');
var mailer = require('../mailer.js');

/* GET bookings */
router.get('/', function(req, res) {
    res.send(dbContext.getBookings());
});

/* create new booking */
router.get('/:id/:startDate/:endDate', function(req, res) {
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
});

module.exports = router;
