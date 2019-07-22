var express = require('express')
var mysql = require('mysql')
var bodyParser = require('body-parser')
var app = express()
var axios = require('axios')
var dbkeys = require('./dbkeys')
var firebase = require("firebase/app");
var moment = require('moment')
var handlebars = require('express-handlebars')
var path = require('path') //Needed for Handlebars
require("firebase/auth");

//DEFINE DB================================================================

var connection = mysql.createConnection({
    host: dbkeys.Xhost,
    user: dbkeys.Xuser,
    password: dbkeys.Xpassword,
    database: dbkeys.Xdatabase,
    dateStrings: true
});

//FIREBASE SETUP================================================================

var firebaseConfig = {
    apiKey: "AIzaSyDMzmrdxKVN6eAuytoJkQjQXD5qC4PYVn4",
    authDomain: "studyhelper-a8dad.firebaseapp.com",
    databaseURL: "https://studyhelper-a8dad.firebaseio.com",
    projectId: "studyhelper-a8dad",
    storageBucket: "",
    messagingSenderId: "1075673230676",
    appId: "1:1075673230676:web:68dbf90b086a22d4"
};

firebase.initializeApp(firebaseConfig);

//EXPRESS PUBLIC FOLDER================================================================

app.use(express.static(__dirname + '/public'));

//BODY PARSER MIDDLEWARE================================================================

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//HANDLEBARS================================================================

app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', handlebars({ defaultLayout: 'standard' }))
app.set('view engine', 'handlebars');

//CONNECT TO DB================================================================

connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected to MySQL!");

    //ROUTES================================================================

    //Force redirection to login route
    app.get('/', function (req, res) {
        res.render('login')
    });

    //Take user to their home page
    app.get('/home', function (req, res) {
        res.render('home')
    });

    //Grab all entries in the table and return as JSON
    app.get('/allentries/:user', function (req, res) {
        var sql = `SELECT * FROM entriespool WHERE user_id='${req.params.user}' ORDER BY date DESC;`
        connection.query(sql, function (err, result) {
            if (err) {
                console.log(err)
            } else {
                let items = [];

                for (i = 0; i < result.length; i++) {
                    items.push(result[i])
                }
                res.send(items)
            }
        })
    });

    //Add an entry for the logged in user
    app.post('/addentry', function (req, res) {
        let timestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        var sql = `INSERT INTO entriespool (user_id, timestamp, date, hours, comments, proglang, subtech) VALUES ("${req.body.userid}", "${timestamp}", "${req.body.date}", "${req.body.hours}", "${req.body.comments}", "${req.body.proglang}", "${req.body.subtech}");`
        console.log(sql)
        connection.query(sql, function (err, result) {
        })
        res.render('home')
    });

    //Process entry deletion request
    app.post('/deleteentry', function (req, res) {
        var sql = `DELETE FROM entriespool WHERE ID = '${req.body.ID}';`
        console.log(sql)
        connection.query(sql, function (err) {
            if (err) throw err;
            res.render('home')
        });
    });

    //START SERVER================================================================

});

app.listen(5500, function () {
    console.log('Server listening on Port 5500...')
})