const express = require('express');
const session = require('express-session');
const passport = require('passport');
const WebAppStrategy = require('ibmcloud-appid').WebAppStrategy;
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const port = 3000;

// Middleware setup
app.use(session({
    secret: '123456',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/BOOKS', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', () => console.log("Error connecting to the database."));
db.once('open', () => console.log("Connected to the database."));

// Passport setup for IBM App ID
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

passport.use(new WebAppStrategy({
    tenantId: "9226bf7e-f7e7-4146-a38a-56998d80352b",
    clientId: "680bc435-78e9-4cc1-9f3b-1d1cad77062f",
    secret: "ZjhkNjk2NGQtMzUxOC00YWU5LWFlYTItNGE4OThmYjNiNjhm",
    oauthServerUrl: "https://au-syd.appid.cloud.ibm.com/oauth/v4/9226bf7e-f7e7-4146-a38a-56998d80352b",
    redirectUri: "http://localhost:3000/appid/callback"
}));

// Routes for IBM App ID Authentication
app.get('/appid/login', passport.authenticate(WebAppStrategy.STRATEGY_NAME, {
    successRedirect: '/Car.html',
    forceLogin: true
}));

app.get('/appid/callback', passport.authenticate(WebAppStrategy.STRATEGY_NAME, { keepSessionInfo: true }));

app.get('/appid/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error(err);
        }
        res.redirect('/');
    });
});

// Protect API routes
app.use('/api', (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.status(401).send("Unauthorized");
    }
});

// API route to get user details
app.get('/api/user', (req, res) => {
    console.log(req.session[WebAppStrategy.AUTH_CONTEXT]);
    res.json({
        user: {
            name: req.user.name
        }
    });
});

// MongoDB Routes for Sign Up and Booking
app.post('/sign_up', (req, res) => {
    const { username, password } = req.body;

    const data = { username, password };

    db.collection('users').insertOne(data, (err) => {
        if (err) {
            console.error("Error inserting record:", err);
            res.status(500).send("Error signing up.");
        } else {
            console.log("Record inserted successfully.");
            res.redirect('/car');
        }
    });
});

app.post('/My_Booking', (req, res) => {
    const { name, email, phno, pickup, dropoff, date } = req.body;

    const data = { name, email, phno, pickup, dropoff, date };

    db.collection('booking').insertOne(data, (err) => {
        if (err) {
            console.error("Error inserting booking:", err);
            res.status(500).send("Error booking.");
        } else {
            console.log("Booking record inserted successfully.");
            res.redirect('/thanks.html');
        }
    });
});

// Serve static files and default route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/car', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Car.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
