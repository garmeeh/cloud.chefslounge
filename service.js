var application_root = __dirname,
    express = require("express"),
    path = require("path");
var cors = require('cors');
var mongo = require('mongodb');
var mongoUri = process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL ||
    'mongodb://admin:admin@ds037758.mongolab.com:37758/heroku_app24428527';

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
// DB connection and var
//====================================\\
var MONGODB_URI = 'mongodb-uri';
var db;
var collreview;
var collusers;
var collbookings;


// Initialize connection to database
mongo.Db.connect(mongoUri, function(err, database) {
    if (err) throw err;

    db = database;
    collreview = db.collection('reviews');
    collusers = db.collection('users');
    collbookings = db.collection('bookings');


});

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

    //db insert
    collreview.insert({
        email: jsonData.email,
        rating: jsonData.rating,
        rtitle: jsonData.rtitle,
        message: jsonData.message
    }, {
        safe: true
    }, function(er, res) {});

    res.send({
        test: 'successful'
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
    //db insert
    collusers.insert(
        jsonData, {
            safe: true
        }, function(er, rs) {});

    res.send({
        userentry: 'successful'
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


    collbookings.insert({
        dateOfBooking: jsonData.bookingdate,
        timeOfBooking: jsonData.bookingtime,
        noOfGuests: jsonData.bookingguests
    }, {
        safe: true
    }, function(er, rs) {});

    res.send({
        bookingentry: 'successful'
    });

});
// ======  ALL GETS ARE HERE! ======\\
//==================================================================================\\

// Review
//==================================\\
app.get('/getreview', function(req, res) {

    console.log("getreview cloud");

    collreview.find().toArray(function(err, rev) {
        console.log("getreview array function", rev);
        res.send({
            reviewdata: rev
        })
    })

});

// Handle Sign In
//======================//
app.get('/getusers', function(req, res) {

    console.log("getuser cloud");

    collusers.find().toArray(function(err, users) {
        console.log("getusers array function", users);
        res.send({
            userdata: users
        })
    })

});



app.listen(process.env.PORT || 5000);