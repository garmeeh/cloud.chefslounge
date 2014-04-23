var application_root = __dirname,
  express = require("express"),
	path = require("path");
  
  var mongo = require('mongodb');
  var mongoUri = process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://admin:admin@ds037758.mongolab.com:37758/heroku_app24428527';

  mongo.Db.connect(mongoUri, function (err, db) {
  db.collection('mydocs', function(er, collection) {
    collection.insert({'mykey': 'myvalue'}, {safe: true}, function(er,rs) {
    });
  });
});

  var app = express();

// Config

app.configure(function () {
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(express.multipart());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(application_root, "public")));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});



// Test API
//================================\\
app.get('/', function(req, res) {
  res.send('Hello World!');
});


// app.get('/getangularusers', function (req, res) {
// 	res.header("Access-Control-Allow-Origin", "*");
// 	res.header("Access-Control-Allow-Methods", "GET, POST");
// 	db.reviews.find('', function(err, review) {
// 	if( err || !review) console.log("No review found");
// 	  else 
// 	{
//     res.writeHead(200, {'Content-Type': 'application/json'});
//     str='[';
//     review.forEach( function(review) {
//       str = str + '{ "email" : "' + review.email + '","rating" : "' + review.rating + '"},' +'\n';
//     });
//     str = str.trim();
//     str = str.substring(0,str.length-1);
//     str = str + ']';
//     res.end( str);
// 	}
//   });
// });

// Handle Review Inserts
//==================================\\
app.post('/insertreview', function (req, res){
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

    mongo.Db.connect(mongoUri, function (err, db) {
    db.collection('reviews', function(er, collection) {
      collection.insert({email: jsonData.email, rating: jsonData.rating, rtitle: jsonData.rtitle, message: jsonData.message}, {safe: true}, function(er,rs) {
          });
        });
      });

});



// Handle Bookings
//==================================\\
app.post('/insertbooking', function (req, res){
  console.log("POST: ");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST");

    console.log(req.body);
    console.log(req.body.bookingdata);

  var jsonData = JSON.parse(req.body.bookingdata);
    
    console.log(jsonData.bookingdate);
    console.log(jsonData.bookingtime);
    console.log(jsonData.bookingguests);

  mongo.Db.connect(mongoUri, function (err, db) {
  db.collection('bookings', function(er, collection) {
    collection.insert({dateOfBooking: jsonData.bookingdate, timeOfBooking: jsonData.bookingtime, noOfGuests: jsonData.bookingguests}, {safe: true}, function(er,rs) {
        });
      });
    });

});

// Handle Menu Gets
//==================================\\
app.get('/getmenu', function (req, res) {
 res.header("Access-Control-Allow-Origin", "*");
 res.header("Access-Control-Allow-Methods", "GET, POST");

// Connect to the db
mongo.Db.connect(mongoUri, function (err, db) {
  if(err) { return console.dir(err); }

  var collection = db.collection('menus');
  // var docs = [{mykey:1}, {mykey:2}, {mykey:3}];

  // collection.insert(docs, {w:1}, function(err, result) {

    collection.find().toArray(function(err, items) {});

    var stream = collection.find({id:{$ne:2}}).stream();
    stream.on("data", function(item) {});
    stream.on("end", function() {});

    collection.findOne({id:1}, function(err, item) {});

    res.send('Menus');


   });
});




//  db.reviews.find('', function(err, review) {
//  if( err || !review) console.log("No review found");
//    else 
//  {
//     res.writeHead(200, {'Content-Type': 'application/json'});
//     str='[';
//     review.forEach( function(review) {
//       str = str + '{ "email" : "' + review.email + '","rating" : "' + review.rating + '"},' +'\n';
//     });
//     str = str.trim();
//     str = str.substring(0,str.length-1);
//     str = str + ']';
//     res.end( str);
//  }
//   });
// });

//     mongo.Db.connect(mongoUri, function (err, db) {
//     db.collection('reviews', function(er, collection) {
//       collection.insert({email: jsonData.email, rating: jsonData.rating, rtitle: jsonData.rtitle, message: jsonData.message}, {safe: true}, function(er,rs) {
//           });
//         });
//       });

// });
  
 




app.listen(process.env.PORT || 5000);