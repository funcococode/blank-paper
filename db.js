const mysql = require('mysql');
const util = require('./utility');



let con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'iam@root9424_',
    database: 'blankpaper'
})

con.connect(function (err) {
    if (err) throw 'Error Connecting to database';
})


let insertUser = (firstname, lastname, email, password, username) => {
    let sql = `INSERT INTO users(firstname,lastname,email,password,username) VALUES("${firstname}","${lastname}","${email}","${password}","${username}")`;
    con.query(sql, (err, res) => {
        if (err) throw err;
        console.log('inserted')
    })
}

let loginUser = (username, password) => {
    return new Promise((resolve, reject) => {
        let sql = `SELECT COUNT(username) as total,password as hash FROM users WHERE username = "${username}"`;
        con.query(sql, (err, res) => {
            if (err) reject(err);
            total = res[0].total
            hash = res[0].hash

            util.checkPassword(password, hash).then(result => {
                result ? resolve(total) : reject(1);
            });
        });
    });
}

let checkuser = (username) => {
    return new Promise((resolve, reject) => {
        let sql = `SELECT COUNT(username) as total FROM users WHERE username = "${username}"`;
        con.query(sql, (err, res) => {
            if (err) reject(err);
            total = res[0].total
            resolve(total);
        })
    })
}


let getDetails = username => {
    return new Promise((resolve, reject) => {
        let sql = `SELECT firstname,lastname,username,email,password FROM users WHERE username = "${username}" LIMIT 1`;
        con.query(sql, (err, res) => {
            if (err) reject(err);
            resolve(res);
        })
    })
}


let updateDetails = (username, field, value) => {
    let sql;
    if (field == "fullname") {
        let [firstname, lastname] = value.split(' ');
        sql = `UPDATE users SET firstname = "${firstname}", lastname = "${lastname}" WHERE username="${username}" LIMIT 1`;
    } else {
        sql = `UPDATE users SET ${field} = "${value}" WHERE username="${username}" LIMIT 1`;
    }

    return new Promise((resolve, reject) => {
        con.query(sql, (err, res) => {
            if (err) reject(err);
            resolve("res");
        });
    });
};


let getSearchUsers = (username, value) => {
    return new Promise((resolve, reject) => {
        // let sql = ` SELECT distinct firstname,lastname, username,from_username,to_username,status FROM users LEFT JOIN (SELECT from_username,to_username,status FROM friends WHERE to_username='${username}' OR from_username='${username}') AS fr ON fr.from_username = username OR fr.to_username=username WHERE firstname LIKE '${value}%'`;
        // let sql = `SELECT firstname,lastname,from_username,to_username,username,status FROM users LEFT JOIN friends ON friends.to_username = users.username AND friends.from_username='${username}' WHERE firstname LIKE '${value}%' OR to_username = '${username}' AND NOT username='${username}' LIMIT 10`;
        let sql = `SELECT firstname,lastname,username FROM users WHERE firstname LIKE '${value}%' OR lastname LIKE '${value}%' AND NOT username="${username}"`;
        con.query(sql, (err, res) => {
            if (err) throw (err);
            // console.log(res)
            resolve(res);
        });
    });
};


let getFriends = (username) => {
    return new Promise((resolve, reject) => {
        let sql = `SELECT firstname,lastname FROM users WHERE username IN
            (SELECT to_username FROM friends WHERE from_username = '${username}' AND status=1)
            OR username IN (SELECT from_username FROM friends WHERE to_username = '${username}' AND status=1);
        `;
        con.query(sql, (err, res) => {
            if (err) throw err;
            resolve(JSON.stringify(res));
        });
    })
};
let createFriendRequest = (from, to) => {
    return new Promise((resolve, reject) => {
        let sql = `INSERT INTO friends(from_username,to_username) VALUES("${from}","${to}")`;
        con.query(sql, (err, res) => {
            if (err) throw err;
            resolve(JSON.stringify('Request Sent!'));
        });
    })
};
let deleteFriendRequest = (from, to) => {
    return new Promise((resolve, reject) => {
        let sql = `DELETE FROM friends WHERE from_username='${from}' AND to_username='${to}' LIMIT 1`;
        con.query(sql, (err, res) => {
            if (err) throw err;
            resolve(JSON.stringify('Request Deleted!'));
        });
    })
};
let acceptFriendRequest = (from, to) => {
    return new Promise((resolve, reject) => {
        let sql = `UPDATE friends SET status=1 WHERE from_username='${from}' AND to_username='${to}' LIMIT 1`;
        con.query(sql, (err, res) => {
            if (err) throw err;
            resolve(JSON.stringify('Accepted friend request!'));
        });
    })
};

//ONLY USED ONCE
let encryptAllPass = () => {
    let sql = `SELECT username,password FROM users`;
    con.query(sql, (err, res) => {
        if (err) throw (err);
        let arr = res.map(data => [data.username, data.password]);
        arr.forEach(user => {
            util.encryptPassword(user[1]).then(hash => {
                new Promise((resolve, reject) => {
                    let sql1 = `UPDATE users SET password = '${hash}' WHERE username = "${user[0]}"`;
                    resolve(con.query(sql1, (err, res) => {
                        if (err) throw (err);
                    }));

                })
            }).catch(err => console.log(err));
        });
    });
};

module.exports = {
    insertUser,
    loginUser,
    checkuser,
    getDetails,
    updateDetails,
    getSearchUsers,
    getFriends,
    createFriendRequest,
    deleteFriendRequest,
    acceptFriendRequest
};



// [ 'rachit05', 'holapola' ]
// [ 'himpan', 'golamola' ]
// [ 'varushi', 'varunrushi' ]
// [ 'Utkarsh123', 'Utputkut' ]
// [ 'Anmol332', 'Anmol' ]
// [ 'harshit', 'harshit' ]
// [ 'Rajvi', 'rajvi' ]
// [ 'Khush', 'Khush' ]
// [ 'chandu', 'chandu' ]
// [ 'Naman', 'Naman' ]
// [ 'Pirapira', 'pirapira' ]
// [ 'kartik', 'kartik' ]
// [ 'Vikky', 'Vikky' ]
// [ 'null', 'null' ]
// [ 'Harish1997', 'Harishji' ]
// [ 'Rachna880', 'Rachnapandey' ]
// [ 'rootgroot', 'rootgroot' ]
// [ 'sracgod', 'sracgod' ]
// [ 'kureel', 'kureelrachna' ]
// [ 'mohini', 'Mohini123@' ]
// [ 'rajaraja', 'Rajabhai1_' ]
// [ 'duttabhai', 'Duttaji123_' ]
// [ 'Harry', 'Harry1771_' ]