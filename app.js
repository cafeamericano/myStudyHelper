var express = require('express')
var mysql = require('mysql')
var bodyParser = require('body-parser')
var app = express()
var axios = require('axios')
var dbkeys = require('./dbkeys')

//DEFINE DB================================================================

var connection = mysql.createConnection({
    host: dbkeys.Xhost,
    user: dbkeys.Xuser,
    password: dbkeys.Xpassword,
    database: dbkeys.Xdatabase,
    dateStrings: true
});

//MIDDLEWARE================================================================

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//CONNECT TO DB================================================================

connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected to MySQL!");

    //ROUTES================================================================

    //Login routes__________________________________________________________________________________________________

    //Force redirection to login route
    app.get('/', function (req, res) {
        res.sendFile('/index.html')
    });

    //Grab all entries in the table and return as JSON
    app.get('/allentries', function (req, res) {
        var sql = "SELECT * FROM entriespool ORDER BY date DESC;"
        connection.query(sql, function (err, result) {
            let items = [];
            for (i = 0; i < result.length; i++) {
                items.push(result[i])
            }
            console.log(items)
            res.send(items)
        })
    });

    //START SERVER================================================================

});

app.listen(5000, function () {
    console.log('Server listening on Port 5000...')
})