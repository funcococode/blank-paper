const express = require('express');
// const router = express.Router()
const session = require('express-session');
const util = require('./utility');

const path = require('path');
const db = require('./db');
// const router = require('./router');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const oneday = 1000 * 60 * 60 * 24;
app.use(session({
    secret: "Thisismysecretkey7000584572@rootuser_",
    saveUninitialized: true,
    cookie: {
        maxAge: oneday
    },
    resave: false
}));

let sess;


app.get('/', (req, res) => {
    sess = req.session;
    if (sess.username) {
        res.sendFile(path.join(__dirname, 'home.html'))
    } else {
        res.sendFile(path.join(__dirname, 'index.html'));
    }
})

app.get('/home', (req, res) => {
    sess = req.session;
    if (sess.username) {
        res.sendFile(path.join(__dirname, 'home.html'))
    } else {
        res.redirect('/')
    }
})

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});


app.post('/register', (req, res) => {
    const {
        firstname,
        lastname,
        email,
        username,
        password
    } = req.body;
    db.checkuser(username).then(result => {
        if (result == 1) {
            res.send(JSON.stringify("NO"))
        } else {
            util.encryptPassword(password).then(hashedPass => {
                db.insertUser(firstname, lastname, email, hashedPass, username);
                res.send(JSON.stringify("YES"))
            });
        }
    });
});

app.post('/login', (req, res) => {
    const {
        username,
        password
    } = req.body;
    db.loginUser(username, password).then(result => {
        sess = req.session;
        sess.username = username;
        res.send(JSON.stringify("YES"))
    }).catch(err => res.end(JSON.stringify('Username or password incorrect')))
})

app.post('/checkuser', (req, res) => {
    const {
        username
    } = req.body;
    db.checkuser(username).then(result => {
        if (result == 1) {
            res.send(JSON.stringify("NO"))
        } else {
            res.send(JSON.stringify("YES"))
        }
    })
})


app.get('/home/details', (req, res) => {
    username = req.session.username;
    if (!username) {
        res.redirect('/')
    } else {
        db.getDetails(username)
            .then(result => res.send(JSON.stringify(result)));
    }
});

app.get('/user/:username', (req, res) => {
    let username = req.params.username;
    db.getDetails(username)
        .then(result => res.send(JSON.stringify(result)));
});
app.post('/user/:username/update', (req, res) => {
    const {
        username,
        field,
        value
    } = req.body;
    db.updateDetails(username, field, value)
        .then(result => res.send(JSON.stringify(result)));
});
app.post('/user/search', (req, res) => {
    const {
        value
    } = req.body;
    db.getSearchUsers(req.session.username, value)
        .then(result => res.send(JSON.stringify(result)));
});
app.post('/user/getFriends', (req, res) => {
    const {
        username
    } = req.body;
    db.getFriends(username)
        .then(result => res.send(JSON.stringify(result)));
});
app.post('/user/addFriend', (req, res) => {
    const {
        from,
        to
    } = req.body;
    db.createFriendRequest(from, to)
        .then(result => res.send(JSON.stringify(result)));
});
app.post('/user/removeFriend', (req, res) => {
    const {
        from,
        to
    } = req.body;
    db.deleteFriendRequest(from, to)
        .then(result => res.send(JSON.stringify(result)));
});
app.post('/user/acceptFriend', (req, res) => {
    const {
        from,
        to
    } = req.body;
    db.acceptFriendRequest(from, to)
        .then(result => res.send(JSON.stringify(result)));
});


app.listen(8080, () => {
    console.log('server running on http://localhost:8080');
});