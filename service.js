var application_root = __dirname,
    express = require("express"),
    path = require("path");
var cors = require('cors');
var mongo = require('mongodb');
var app = express();

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



// Config
//================================\\
app.configure(function() {
    app.use(allowCrossDomain);
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.multipart());
    app.use(express.methodOverride());
    app.use(app.router);
    // app.use(express.static(path.join(application_root, "public")));
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
});
// Database
//====================================\\
var databaseUrl = "mongodb://admin:admin@ds037758.mongolab.com:37758/heroku_app24428527";
var collections = ["reviews", "users", "bookings", "menus", "admin", "reviewresponse", "msgcenter", "offers"]
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

    // var loginDetails = req.sbody.userdata;
    console.log("aaa", req.body);
    var data = req.body;

    var user = data.username;

    console.log(user);

    db.admin.find({
        'username': user
    }, function(err, users) {
        console.log("err", err)
        console.log("user", users)

        if (users.length >= 1) {
            var name = users[0].username;
            if (name === user) {
                console.log("user === users[0].username");

                res.send({
                    statusCode: 200,
                    msg: 'successful',
                    payload: {
                        userData: users[0]
                    }
                });
            }
        } else if (users.length === 0) {

            console.log("users undefined")
            res.send({
                statusCode: 500,
                loginErr: 'ERROR!!!'
            });

        } else {
            console.log("404");
            res.send({
                statusCode: 404,
                loginErr: 'ERROR!!!'
            });
        }
    });
});

//Review Response
//==================================\\
app.post('/reviewresponse', function(req, res) {
    console.log("POST: ");
    console.log(req.body);
    console.log(req.body.message);

    var jsonData = JSON.parse(req.body.message);

    console.log(jsonData);

    db.reviewresponse.save(jsonData,
        function(err, saved) { // Query in MongoDB via Mongo JS Module
            if (err || !saved) res.end("Message Not Saved");
            else res.end("Message Saved");
        });


});

//Msg Center
//==================================\\
app.post('/sendmsg', function(req, res) {
    console.log("POST: ");
    console.log(req.body);
    console.log(req.body.enquiry);

    var jsonData = JSON.parse(req.body.enquiry);

    console.log(jsonData);

    db.msgcenter.save(jsonData,
        function(err, saved) { // Query in MongoDB via Mongo JS Module
            if (err || !saved) res.end("Message Not Saved");
            else res.end("Message Saved");
        });


});
//Offer
//==================================\\
app.post('/newoffer', function(req, res) {
    console.log("POST: ");
    console.log(req.body);
    console.log(req.body.offferdata);

    var jsonData = JSON.parse(req.body.offferdata);

    console.log(jsonData);

    db.offers.save(jsonData,
        function(err, saved) { // Query in MongoDB via Mongo JS Module
            if (err || !saved) res.end("Message Not Saved");
            else res.end("Message Saved");
        });


});


// ======  ALL GETS ARE HERE! ======\\
//==================================================================================\\

// Review
//==================================\\
app.get('/getreview', function(req, res) {

    console.log("getreview cloud");


    db.reviews.find(function(err, rev) {

        res.send(rev)
    });

});

// Get users list
//======================//
app.get('/getusers', function(req, res) {

    console.log("getuser cloud");

    db.users.find(function(err, users) {
        // docs is an array of all the documents in mycollection
        JSON.stringify(users);
        res.send(users)
    });

});
// Get users list
//======================//
app.get('/getbookingrequest', function(req, res) {

    console.log("get booking request cloud");

    db.bookings.find(function(err, bookingrequest) {
        // docs is an array of all the documents in mycollection
        JSON.stringify(bookingrequest);
        res.send(bookingrequest)
    });

});
// Get msg 
//======================//
app.get('/getmsg', function(req, res) {

    console.log("get msg cloud");

    db.msgcenter.find(function(err, msg) {
        // docs is an array of all the documents in mycollection
        JSON.stringify(msg);
        res.send(msg)
    });

});
// Get offer 
//======================//
app.get('/getoffer', function(req, res) {

    console.log("get offer cloud");

    db.offers.find(function(err, off) {
        // docs is an array of all the documents in mycollection
        JSON.stringify(off);
        res.send(off)
    });

});



app.listen(process.env.PORT || 5000);