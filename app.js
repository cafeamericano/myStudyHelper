//SERVER PORT NUMBER================================================================

let port = process.env.PORT || 5500

//REQUIREMENTS================================================================

var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var firebase = require('firebase/app');
var moment = require('moment')
var handlebars = require('express-handlebars')
var path = require('path') //Needed for Handlebars
require('firebase/auth');

const { Client } = require('pg');

//DEFINE POSTGRES DATABASE================================================================

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
});

client.connect();

//EXPRESS PUBLIC FOLDER================================================================

app.use(express.static(__dirname + '/public'));

//BODY PARSER MIDDLEWARE================================================================

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//HANDLEBARS================================================================

app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', handlebars({ defaultLayout: 'standard' }))
app.set('view engine', 'handlebars');

//POSTGRES INITIAL QUERIES ================================================================

//Create table query definition
let createTableQuery = `
        CREATE TABLE IF NOT EXISTS
        entriespool(
          id SERIAL PRIMARY KEY,
          user_id TEXT,
          timestamp TIMESTAMP,
          date DATE,
          hours Integer,
          comments TEXT,
          category TEXT,
          proglang TEXT,
          subtech TEXT
        )`;

//Sample query definition
let sampleEntryQuery = `INSERT INTO entriespool (user_id, date, hours, comments, proglang) VALUES ('firebaseuseridgoeshere', '2019-06-22', 3, 'samplerecord', 'JavaScript');`

// //Create table
// client.query(createTableQuery, (err, res) => {
//     if (err) throw err;
//     //client.end();
// });

// //Add data
// client.query(sampleEntryQuery, (err, res) => {
//     if (err) throw err;
//     //client.end();
// });

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
app.get('/allentries/:user', function (req, response) {
    var sql = `SELECT * FROM entriespool WHERE user_id='${req.params.user}' ORDER BY date DESC;`
    client.query(sql, (err, res) => {
        if (err) {
            console.log(err)
        } else {
            console.log(res)
            let items = [];
            for (let row of res.rows) {
                items.push(row)
            }
            console.log(items)
            response.send(items)
        }
    })
});

//Grab all entries in the table and return as JSON
app.get('/entryByID/:id', function (req, response) {
    var sql = `SELECT * FROM entriespool WHERE id='${req.params.id}';`
    console.log(sql)
    client.query(sql, (err, res) => {
        if (err) {
            console.log(err)
        } else {
            let items = [];
            for (let row of res.rows) {
                items.push(row)
            }
            response.send(items)
        }
    })
});

//Add an entry for the logged in user
app.post('/addentry', function (req, response) {
    let timestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    var sql = `INSERT INTO entriespool (user_id, timestamp, date, hours, comments, proglang, subtech) VALUES ('${req.body.userid}', '${timestamp}', '${req.body.date}', '${req.body.hours}', '${req.body.comments}', '${req.body.proglang}', '${req.body.subtech}');`
    console.log(sql)
    client.query(sql, (err, res) => {
    })
    response.redirect('/home')
});

//Process entry deletion request
app.post('/deleteentry', function (req, response) {
    var sql = `DELETE FROM entriespool WHERE ID = '${req.body.ID}';`
    console.log(sql)
    client.query(sql, (err, res) => {
        if (err) throw err;
        response.redirect('/home')
    });
});

//Process entry edit request
app.post('/editentry', function (req, response) {
    var sql = `UPDATE entriespool SET date = '${req.body.dateEdit}', hours = '${req.body.hoursEdit}', comments = '${req.body.commentsEdit}', proglang = '${req.body.proglangEdit}' where ID = '${req.body.recordDatabaseID}';`
    console.log(sql)
    client.query(sql, (err, res) => {
        if (err) throw err;
        response.redirect('/home')
    });
});

//START SERVER================================================================

app.listen(port, function () {
    console.log(`Server listening on Port ${port}...`)
})