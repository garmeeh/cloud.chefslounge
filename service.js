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




app.get('/', function(req, res) {
  res.send('Hello World!');
});


app.get('/getangularusers', function (req, res) {
	res.header("Access-Control-Allow-Origin", "http://localhost:8000");
	res.header("Access-Control-Allow-Methods", "GET, POST");
	db.reviews.find('', function(err, review) {
	if( err || !review) console.log("No review found");
	  else 
	{
    res.writeHead(200, {'Content-Type': 'application/json'});
    str='[';
    review.forEach( function(review) {
      str = str + '{ "email" : "' + review.email + '","rating" : "' + review.rating + '"},' +'\n';
    });
    str = str.trim();
    str = str.substring(0,str.length-1);
    str = str + ']';
    res.end( str);
	}
  });
});

// Handle Reviews
//==================================//
app.post('/insertreview', function (req, res){
  console.log("POST: ");
  res.header("Access-Control-Allow-Origin", "http://localhost:8000");
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
//==================================//
app.post('/insertbooking', function (req, res){
  console.log("POST: ");
  res.header("Access-Control-Allow-Origin", "http://localhost:8000");
  res.header("Access-Control-Allow-Methods", "GET, POST");
  console.log(req.body);
  console.log(req.body.bookingdata);
  var jsonData = JSON.parse(req.body.bookingdata);
  console.log(jsonData.bookingdate);
  console.log(jsonData.bookingtime);
  console.log(jsonData.bookingguests);


  db.bookings.save({dateOfBooking: jsonData.bookingdate, timeOfBooking: jsonData.bookingtime, noOfGuests: jsonData.bookingguests}, function(err, saved) {
  if( err || !saved ) res.end( "Booking not saved"); 
  else res.end( "Booking saved");
});
});

  
 




app.listen(process.env.PORT || 5000);