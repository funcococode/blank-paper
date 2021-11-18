const bcrypt = require('bcrypt');

function encryptPassword(password) {
    let salt = 10;
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, salt).then(function (hash) {
            resolve(hash);
        });
    });
}

function checkPassword(password, hash) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hash).then(function (result) {
            resolve(result);
        });
    });
}


module.exports = {
    encryptPassword,
    checkPassword,
};