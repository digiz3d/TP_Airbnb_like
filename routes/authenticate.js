const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

router.patch('/', function(req, res) {
    User.findOne({ login: req.body.login }, function (err, user) {
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
                        let token = jwt.sign({ id: user.id, login: user.login, email: user.email }, config.jwtSecret, { expiresIn: 60 * 60 });
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