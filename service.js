var application_root = __dirname,
    express = require("express"),
    path = require("path");
var cors = require('cors');
var mongo = require('mongodb');

// CORS 
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.send(200);
    } else {
        next();
    }
};


var app = express();

// Config
//================================\\
app.configure(function() {
    app.use(allowCrossDomain);
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.multipart());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(application_root, "public")));
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
});
// Database
//====================================\\
var databaseUrl = "mongodb://admin:admin@ds037758.mongolab.com:37758/heroku_app24428527";
var collections = ["reviews", "users", "bookings", "menus", "admin"]
var db = require("mongojs").connect(databaseUrl, collections);


// Test API for app health
//================================\\
app.get('/', function(req, res) {
    res.send('Hello World!');
});


// ======  ALL POSTS ARE HERE ======\\
//==================================================================================\\

// Handle Review Inserts
//==================================\\
app.post('/insertreview', function(req, res) {
    console.log("POST: ");

    console.log(req.body);
    console.log(req.body.mydata);

    var jsonData = JSON.parse(req.body.mydata);

    console.log(jsonData.rtitle);
    console.log(jsonData.rating);
    console.log(jsonData.email);
    console.log(jsonData.message);

    db.reviews.save(jsonData,
        function(err, saved) { // Query in MongoDB via Mongo JS Module
            if (err || !saved) res.end("Review not saved");
            else res.end("Review saved");
        });

});

// New User
//==================================\\
app.post('/insertuser', function(req, res) {
    console.log("POST: ");
    console.log(req.body);
    console.log(req.body.userdata);

    var jsonData = JSON.parse(req.body.userdata);

    console.log(jsonData);

    db.users.save(jsonData,
        function(err, saved) { // Query in MongoDB via Mongo JS Module
            if (err || !saved) res.end("User not saved");
            else res.end("User saved");
        });


});


// Bookings
//==================================\\
app.post('/insertbooking', function(req, res) {
    console.log("POST: ");

    console.log(req.body);
    console.log(req.body.bookingdata);

    var jsonData = JSON.parse(req.body.bookingdata);

    console.log(jsonData.bookingdate);
    console.log(jsonData.bookingtime);
    console.log(jsonData.bookingguests);

    db.bookings.save(jsonData,
        function(err, saved) { // Query in MongoDB via Mongo JS Module
            if (err || !saved) res.end("Booking not saved");
            else res.end("Booking saved");
        });

});

// Admin Log In
//==================================\\
app.post('/login', function(req, res) {
    console.log("POST: ");

    var loginDetails = JSON.parse(req.body.userdata);

    console.log(loginDetails);



    res.send({
        login: 'successful'
    });

});


// ======  ALL GETS ARE HERE! ======\\
//==================================================================================\\

// Review
//==================================\\
app.get('/getreview', function(req, res) {

    console.log("getreview cloud");


    db.reviews.find(function(err, rev) {
        // docs is an array of all the documents in mycollection
        res.send({
            reviewdata: rev
        })
    });

});

// Get users list
//======================//
app.get('/getusers', function(req, res) {

    console.log("getuser cloud");

    // collusers.find().toArray(function(err, users) {
    //     console.log("getusers array function", users);
    //     res.send({
    //         userdata: users
    //     })
    // })

    db.users.find(function(err, users) {
        // docs is an array of all the documents in mycollection
        res.send({
            reviewdata: users
        })
    });

});



app.listen(process.env.PORT || 5000);