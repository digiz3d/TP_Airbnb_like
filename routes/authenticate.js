const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../app/models/user');

router.patch('/', function(req, res) {
    User.findOne({ email: req.body.email }, function (err, user) {
        if (err) throw err;

        if (!user) {
            res.status(404).json({ success: false, message: 'Authentication failed. User not found.' });
        }
        else if (user) {
            bcrypt.compare(req.body.password, user.password, function (err, result) {
                if (err) {
                    res.status(500).json({ success: false, message: err.message });
                }
                else {                    
                    if (result) {
                        let token = jwt.sign({ id: user._id, email: user.email }, config.jwt.secret, { expiresIn: 60 * 60 });
                        res.cookie('token', token);
                        res.json({
                            success: true,
                            message: 'Enjoy your token!',
                            token: token
                        });
                    }
                    else {
                        res.status(401).json({ success: false, message: 'Wrong username or password' });
                    }
                }
            });
        }
    });
});

module.exports = router;