var application_root = __dirname,
    express = require("express"),
    path = require("path");
var cors = require('cors');
var mongo = require('mongodb');
// var mongoUri = process.env.MONGOLAB_URI ||
//     process.env.MONGOHQ_URL ||
//     'mongodb://admin:admin@ds037758.mongolab.com:37758/heroku_app24428527';

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
var databaseUrl = "mongodb://admin:admin@ds037758.mongolab.com:37758/heroku_app24428527";
var collections = ["reviews", "users", "bookings", "menus", "admin"]
var db = require("mongojs").connect(databaseUrl, collections);


// var MONGODB_URI = 'mongodb-uri';
// var db;
// var collreview;
// var collusers;
// var collbookings;
// var colladmin;


// // Initialize connection to database
// mongo.Db.connect(mongoUri, function(err, database) {
//     if (err) throw err;

//     db = database;
//     collreview = db.collection('reviews');
//     collusers = db.collection('users');
//     collbookings = db.collection('bookings');


// });

// Test API for app health
//================================\\
app.get('/', function(req, res) {
    res.send('Hello World!');
});
// ============****************  CUSTOMER APP ****************************** ======\\
//==================================================================================\\

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
    // collreview.insert({
    //     email: jsonData.email,
    //     rating: jsonData.rating,
    //     rtitle: jsonData.rtitle,
    //     message: jsonData.message
    // }, {
    //     safe: true
    // }, function(er, res) {});

    // res.send({
    //     review: 'successful'
    // });

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
    //db insert
    // collusers.insert(
    //     jsonData, {
    //         safe: true
    //     }, function(er, rs) {});

    // res.send({
    //     userentry: 'successful'
    // });
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


    // collbookings.insert({
    //     dateOfBooking: jsonData.bookingdate,
    //     timeOfBooking: jsonData.bookingtime,
    //     noOfGuests: jsonData.bookingguests
    // }, {
    //     safe: true
    // }, function(er, rs) {});

    // res.send({
    //     bookingentry: 'successful'
    // });
    db.bookings.save(jsonData,
        function(err, saved) { // Query in MongoDB via Mongo JS Module
            if (err || !saved) res.end("Booking not saved");
            else res.end("Booking saved");
        });

});

// Handle Sign In
//======================//
// app.post('/checkusers', function(req, res) {

//     console.log("checkuser cloud");

//     var jsonData = JSON.parse(req.body.user);

//     collusers.find().toArray(function(err, users) {
//         console.log("getusers array function", users);

//         for (var i = 0, len = users.length; i < len; i += 1) {
//             if (users.email === user.email && users.password === user.password) {
//                 res.send({
//                     access: users
//                 })
//             }
//         }

//     })

// });

// ======  ALL GETS ARE HERE! ======\\
//==================================================================================\\

// Review
//==================================\\
app.get('/getreview', function(req, res) {

    console.log("getreview cloud");

    // collreview.find().toArray(function(err, rev) {
    //     console.log("getreview array function", rev);
    //     res.send({
    //         reviewdata: rev
    //     })
    // })

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
// ============****************  ADMIN APP ****************************** ======\\
//==================================================================================\\
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

// Review Listing
//==================================\\
// app.get('/getreview', function(req, res) {

//     console.log("Get Review from cloud");

//     collreview.find().toArray(function(err, rev) {
//         console.log("Get Review DB", rev);

//         res.send({
//             cloudreviewdata: rev
//         })
//     })

// });

app.listen(process.env.PORT || 5000);