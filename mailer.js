var nodemailer = require('nodemailer');

var config = {
    host: "smtp-mail.outlook.com",
    secureConnection: false,
    port: 587,
    auth: {
        user: 'ApiAirbnbLike@outlook.com',
        pass: 'r41NBow$'
    },
    tls: {
        ciphers: "SSLv3",
        rejectUnauthorized: false
    }
};

var transporter = nodemailer.createTransport(config);

module.exports = {
    getMailer: function () {
        return transporter;
    },
    getMessage: function (toUserMail, mailSubject, message) {
        var message = {
            from: 'ApiAirbnbLike@outlook.com',
            to: toUserMail,
            subject: mailSubject,
            text: message
        };
        return message;
    }
}