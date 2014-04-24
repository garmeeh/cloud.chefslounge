var application_root = __dirname,
  express = require("express"),
  path = require("path");
var cors = require('cors');
var mongo = require('mongodb');
var mongoUri = process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://admin:admin@ds037758.mongolab.com:37758/heroku_app24428527';

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

// Test API
//================================\\
app.get('/', function(req, res) {
  res.send('Hello World!');
});

// Handle Review Inserts
//==================================\\
app.post('/insertreview', function(req, res) {
  console.log("POST: ");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST");

  console.log(req.body);
  console.log(req.body.mydata);

  var jsonData = JSON.parse(req.body.mydata);

  console.log(jsonData.rtitle);
  console.log(jsonData.rating);
  console.log(jsonData.email);
  console.log(jsonData.message);
  // console.log(jsonData);

  mongo.Db.connect(mongoUri, function(err, db) {
    db.collection('reviews', function(er, collection) {
      //change jsonData
      collection.insert({
        email: jsonData.email,
        rating: jsonData.rating,
        rtitle: jsonData.rtitle,
        message: jsonData.message
      }, {
        safe: true
      }, function(er, res) {
        // console.log("in db");  });
      });
    });

    //added this
    res.send({
      test: 'successful'
    });

  });
});
// Handle New User
//==================================\\
app.post('/createuser', function(req, res) {
  console.log("POST: ");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST");


  console.log(req.body);
  console.log(req.body.userdata);

  var jsonData = JSON.parse(req.body.userdata);

  console.log(jsonData);


  mongo.Db.connect(mongoUri, function(err, db) {
    db.collection('users', function(er, collection) {
      collection.insert(
        jsonData, {
          safe: true
        }, function(er, rs) {});
    });
  });

});


// Handle Bookings
//==================================\\
app.post('/insertbooking', function(req, res) {
  console.log("POST: ");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST");


  console.log(req.body);
  console.log(req.body.bookingdata);

  var jsonData = JSON.parse(req.body.bookingdata);

  console.log(jsonData.bookingdate);
  console.log(jsonData.bookingtime);
  console.log(jsonData.bookingguests);

  mongo.Db.connect(mongoUri, function(err, db) {
    db.collection('bookings', function(er, collection) {
      collection.insert({
        dateOfBooking: jsonData.bookingdate,
        timeOfBooking: jsonData.bookingtime,
        noOfGuests: jsonData.bookingguests
      }, {
        safe: true
      }, function(er, rs) {});
    });
  });

});

// Handle Review Gets
//==================================\\
var MONGODB_URI = 'mongodb-uri';
var db;
var coll;

// Initialize connection once

mongo.Db.connect(mongoUri, function(err, database) {
  if (err) throw err;

  db = database;
  coll = db.collection('reviews');


});

// Reuse database/collection object 

app.get('/getreview', function(req, res) {

  console.log("getreview cloud");

  coll.find().toArray(function(err, rev) {
    console.log("getreview array function", rev);
    res.send({
      reviewdata: rev
    })
  })
  // coll.find({}, function(err, docs) {
  //   docs.each(function(err, doc) {
  //     if(doc) {
  //       res.write(JSON.stringify(doc) + "\n");
  //     }
  //     else {
  //       res.end();
  //     }
  //   });
  // });
});



app.listen(process.env.PORT || 5000);