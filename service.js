var application_root = __dirname,
  express = require("express"),
	path = require("path");
	var databaseUrl = "chefsdb"; // "username:password@example.com/mydb"
  var collections = ["reviews","bookings"]
  var db = require("mongojs").connect(databaseUrl, collections);
  var app = express();



// Config

app.configure(function () {
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(application_root, "public")));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.get('/api', function (req, res) {
   res.send('Ecomm API is running');
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
	//res.writeHead(200, {'Content-Type': 'text/plain'});
  //user = req.body.username;
  //passwd = req.body.password;
  //emailid = req.body.email;
  console.log(req.body);
  console.log(req.body.mydata);
  var jsonData = JSON.parse(req.body.mydata);
  console.log(jsonData.rtitle);
  console.log(jsonData.rating);
  console.log(jsonData.email);
  console.log(jsonData.email);


  db.reviews.save({email: jsonData.email, rating: jsonData.rating, rtitle: jsonData.rtitle, message: jsonData.message}, function(err, saved) {
  if( err || !saved ) res.end( "Review not saved"); 
  else res.end( "Review saved");
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

  
 




app.listen(1212);