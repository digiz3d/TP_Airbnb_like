module.exports = {
    mongodb : {
        url : 'mongodb://admin:123456*m@airbnblike-shard-00-00-rcbjh.mongodb.net:27017,airbnblike-shard-00-01-rcbjh.mongodb.net:27017,airbnblike-shard-00-02-rcbjh.mongodb.net:27017/db?ssl=true&replicaSet=airbnblike-shard-0&authSource=admin'
    },
    mail : {
        host: 'smtp-mail.outlook.com',
        secureConnection: false,
        port: 587,
        auth: {
            user: 'ApiAirbnbLike@outlook.com',
            pass: 'r41NBow$'
        },
        tls: {
            ciphers: 'SSLv3',
            rejectUnauthorized: false
        }
    },
    jwt : {
        secret : 'Y7_**y@mR8L=e#u#RxDyS/#}DwGK=`_W!54/{V%uX>h(hh2ZWNb=<3"bA23Qd9'
    }
};