//SERVER PORT NUMBER================================================================

let port = process.env.PORT || 5500

//REQUIREMENTS================================================================

var express = require('express')
var mysql = require('mysql')
var bodyParser = require('body-parser')
var app = express()
var firebase = require("firebase/app");
var moment = require('moment')
var handlebars = require('express-handlebars')
var path = require('path') //Needed for Handlebars
require("firebase/auth");

const { Client } = require('pg');

//DEFINE MYSQL DATABASE================================================================

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

//ROUTES================================================================

//Force redirection to login route
app.get('/', function (req, res) {
    client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
        if (err) throw err;
        for (let row of res.rows) {
            console.log(JSON.stringify(row));
        }
        client.end();
    });
    res.render('login')
});

//Take user to their home page
app.get('/home', function (req, res) {
    res.render('home')
});

// //Grab all entries in the table and return as JSON
// app.get('/allentries/:user', function (req, res) {
//     var sql = `SELECT * FROM entriespool WHERE user_id='${req.params.user}' ORDER BY date DESC;`
//     connection.query(sql, function (err, result) {
//         if (err) {
//             console.log(err)
//         } else {
//             let items = [];

//             for (i = 0; i < result.length; i++) {
//                 items.push(result[i])
//             }
//             res.send(items)
//         }
//     })
// });

// //Grab all entries in the table and return as JSON
// app.get('/entryByID/:id', function (req, res) {
//     var sql = `SELECT * FROM entriespool WHERE id='${req.params.id}';`
//     console.log(sql)
//     connection.query(sql, function (err, result) {
//         if (err) {
//             console.log(err)
//         } else {
//             let items = [];
//             console.log(result)
//             for (i = 0; i < result.length; i++) {
//                 items.push(result[i])
//             }
//             res.send(items)
//         }
//     })
// });

// //Add an entry for the logged in user
// app.post('/addentry', function (req, res) {
//     let timestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
//     var sql = `INSERT INTO entriespool (user_id, timestamp, date, hours, comments, proglang, subtech) VALUES ("${req.body.userid}", "${timestamp}", "${req.body.date}", "${req.body.hours}", "${req.body.comments}", "${req.body.proglang}", "${req.body.subtech}");`
//     console.log(sql)
//     connection.query(sql, function (err, result) {
//     })
//     res.redirect('/home')
// });

// //Process entry deletion request
// app.post('/deleteentry', function (req, res) {
//     var sql = `DELETE FROM entriespool WHERE ID = '${req.body.ID}';`
//     console.log(sql)
//     connection.query(sql, function (err) {
//         if (err) throw err;
//         res.redirect('/home')
//     });
// });

// //Process entry edit request
// app.post('/editentry', function (req, res) {
//     var sql = `UPDATE entriespool SET date = "${req.body.dateEdit}", hours = "${req.body.hoursEdit}", comments = "${req.body.commentsEdit}", proglang = "${req.body.proglangEdit}" where ID = "${req.body.recordDatabaseID}";`
//     console.log(sql)
//     connection.query(sql, function (err) {
//         if (err) throw err;
//         res.redirect('/home')
//     });
// });

//START SERVER================================================================

app.listen(port, function () {
    console.log(`Server listening on Port ${port}...`)
})