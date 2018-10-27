// Bring in Dependcies
var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var path = require('path');

// Set mongoose to leverage built in ES6
mongoose.Promise = Promise;

// Define Port
var PORT = process.env.PORT || 3000;

// Initialize express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger('dev'));

// Parser request body as JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// set static directory
app.use(express.static(path.join(__dirname, 'public')));

// Handlebars
app.engine(
  'handlebars',
  exphbs({
    defaultLayout: 'main'
  })
);
app.set('view engine', 'handlebars');

// Connect to the Mongo DB
mongoose.connect(
  'mongodb://localhost/newmongoarticle',
  { useNewUrlParserl: true }
);
var db = mongoose.connection;

//show any mongoose errors
db.on('error', function(error) {
  console.log('Mongose Error: ' + error);
});
// Once logged in to the db through mongoose, log a success message
db.once('open', function() {
  console.log('Mongoose connection successful.');
});
// Routes
require('./routes/htmlRoutes.js')(app);

app.listen(PORT, function() {
  console.log('App running on port ' + PORT);
});
