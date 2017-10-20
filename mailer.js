var nodemailer = require('nodemailer');

var config = {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'cpe.development.global@gmail.com',
        pass: '6@Z*!LKu=Lns`.Gdnzi8k"*wyr$.Y*'
    }
};

var transporter = nodemailer.createTransport(config);

module.exports = {
    getMailer: function () {
        return transporter;
    },
    getMessage: function (toUserMail, mailSubject, message) {
        var message = {
            from: 'cpe.development.global@gmail.com',
            to: toUserMail,
            subject: mailSubject,
            text: message
        };
        return message;
    }
}