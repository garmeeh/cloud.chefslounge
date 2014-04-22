  var mongo = require('mongodb');
  var mongoUri = process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://admin:admin@ds037758.mongolab.com:37758/heroku_app24428527';

 

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
  console.log(jsonData.email);

   mongo.Db.connect(mongoUri, function (err, db) {
  db.collection('reviews', function(er, collection) {
    collection.insert({email: jsonData.email, rating: jsonData.rating, rtitle: jsonData.rtitle, message: jsonData.message}, {safe: true}, function(er,rs) {
    });
  });
});
 