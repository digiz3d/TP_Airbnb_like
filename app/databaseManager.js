var fs = require('fs');
var clone = require('clone');
var usersDb = JSON.parse(fs.readFileSync('./data/users.json', 'utf8'));
var housesDb = JSON.parse(fs.readFileSync('./data/housing.json', 'utf8'));
var bcrypt = require('bcrypt');

mongoose.connect("mongodb://admin:test@airbnblike-shard-00-00-rcbjh.mongodb.net:27017,airbnblike-shard-00-01-rcbjh.mongodb.net:27017,airbnblike-shard-00-02-rcbjh.mongodb.net:27017/db?ssl=true&replicaSet=airbnblike-shard-0&authSource=admin");

/*
var premierUtilisateur = new user({
    "email": "josiane32ans@gmail.com",
    "password": "$2a$10$W1oC8PMuZaezaKNpSMJqvOlCBlHZHfM7oYBouNV/Yxw9ZEJvZyQz.",
    "lastname": "Le Maire",
    "firstname": "Josiane",
    "token" : ""
});
premierUtilisateur.save(function (err) {if (err) console.log ('Error on save!')});

var premierPPartement = new appartement({
    name: "Maison blanche",
    description: "Un truc de dirigeant",
    city: "Washington",
    price: 42,
    beds: 69,
    rooms: 115,
    // bookedDates: [
    //     {
    //         start: new Date(2014,1,1),
    //         end: new Date(2014,1,15)
    //     }
    // ]
});
premierPPartement.save(function (err) {if (err) console.log ('Error on save!')});

var nouvelleReservation = new booking({
    start: new Date(2014,1,1),
    end: new Date(2014,1,15),
    id_appartement: "Maison blanche",
    id_user: "patrick.dupont@gmail.com"
});

nouvelleReservation.save(function (err) {if (err) console.log ('Error on save!')});
*/
function checkHouseDates(houseId, startDate, endDate) {
    for (let dateTuple in housesDb[houseId].bookedDates) {
        if ((Date.parse(startDate) >= Date.parse(housesDb[houseId].bookedDates[dateTuple].start) &&     /* date de départ   supérieure à la date de départ  réservée */
            Date.parse(endDate) <= Date.parse(housesDb[houseId].bookedDates[dateTuple].end)) ||         /* date de fin      inférieure à la date de fin     réservée */
            (Date.parse(startDate) <= Date.parse(housesDb[houseId].bookedDates[dateTuple].start) &&     /* date de départ   inférieure à la date de départ  réservée */
                Date.parse(endDate) >= Date.parse(housesDb[houseId].bookedDates[dateTuple].start)) ||   /* date de fin      supérieure à la date de départ  réservée */
            (Date.parse(startDate) <= Date.parse(housesDb[houseId].bookedDates[dateTuple].end) &&       /* date de départ   inférieure à la date de fin     réservée */
                Date.parse(endDate) >= Date.parse(housesDb[houseId].bookedDates[dateTuple].end))) {     /* date de fin      supérieure à la date de fin     réservée */
            return true
        }
    }
    return false;
}

module.exports = {
    createUser: function(email, password, firstname, lastname) {
        var newUser = new User({
            email: email,
            password: bcrypt.hashSync(password, 10),
            firstname: firstname,
            lastname: lastname
        });
        newUser.save(function (err) {if (err) console.log ('Error on save!')});
    },
    getUser: function (email) {
        return User.findOne({'email': email}, 'email firstname lastname').exec();
    },
    getUsers: function () {
        return User.find({},'email firstname lastname').exec();
    },
    setUserInfo: function (email, key, value) {
        return User.update({email: email}, {"$set": {[key]: value}}).exec();
    },
    setUserToken: function (username, token) {
        usersDb[username].token = token;
    },
    verifyUserToken: function (sessionToken) {
        for (var userKey in usersDb) {
            if (userKey.token === token) {
                return true
            }
        }
        return false;
    },
    getHousesByCity: function (city) {
        let arr = [];
        for (let x in housesDb) {
            if (housesDb[x].city.toUpperCase() === city.toUpperCase()) {
                arr.push(housesDb[x]);
            }
        }
        return arr;
    },
    getHouses: function (city = null, beds = null, priceMin = null, priceMax = null, startDate = null, endDate = null) {
        let arrCopy = clone(housesDb);
        for (let x in arrCopy) {
            if (city && arrCopy[x].city.toUpperCase() !== city.toUpperCase()) {
                delete arrCopy[x];
                continue;
            }
            if (beds && parseInt(arrCopy[x].beds) !== parseInt(beds)) {
                delete arrCopy[x];
                continue;
            }
            if (priceMin && parseInt(arrCopy[x].price) < parseInt(priceMin)) {
                delete arrCopy[x];
                continue;
            }
            if (priceMax && parseInt(arrCopy[x].price) > parseInt(priceMax)) {
                delete arrCopy[x];
                continue;
            }
            if (startDate && endDate) {
                if (checkHouseDates(x, startDate, endDate)) {
                    delete arrCopy[x];
                    continue;
                }
            }
        }
        return arrCopy;
    },
    isHouseBooked: function (id, startDate, endDate) {
        return checkHouseDates(id, startDate, endDate);
    },
    setHouseBooked: function (id, startDate, endDate) {
        if (!housesDb[id].bookedDates) {
            housesDb[id].bookedDates = [];
        }
        housesDb[id].bookedDates.push({
            start: startDate,
            end: endDate
        });
    },
    getHouseById: function (id) {
        if (housesDb[id]) {
            return housesDb[id];
        } else {
            return null;
        }
    },
    getBookings() {
        let bookings = [];
        for (let h in housesDb) {
            if (housesDb[h].bookedDates) {
                bookings.push(housesDb[h]);
            }
        }
        return bookings;
    }
}
