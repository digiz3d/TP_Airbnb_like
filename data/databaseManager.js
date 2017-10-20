var fs = require('fs');
var clone = require('clone');
var usersDb = JSON.parse(fs.readFileSync('./data/users.json', 'utf8'));
var housesDb = JSON.parse(fs.readFileSync('./data/housing.json', 'utf8'));

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
    getUserNoPassword: function (username) {
        let user = usersDb[username] || null;
        /* so we don't delete the original password :^) */
        let ret = clone(user);
        if (ret.password) delete ret.password;
        return ret;
    },
    getUser: function (username) {
        return usersDb[username] || null;
    },
    getUsers: function () {
        return usersDb;
    },
    setUserInfo: function (username, key, value = null) {
        usersDb[username][key] = value;
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
