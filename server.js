// Bring in Dependcies
var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var path = require('path');

// Scraping tools
var axios = require('axios');
var cheerio = require('cheerio');

// Require all models
// var db = require('./models');

var PORT = process.env.PORT || 3000;

// Initialize express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger('dev'));

// Parser request body as JSON
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Connect to the Mongo DB
// mongoose.connect(
//   'mongodb://localhost/article',
//   { useNewUrlParserl: true }
// );

// Handlebars
app.engine(
  'handlebars',
  exphbs({
    defaultLayout: 'main'
  })
);
app.set('view engine', 'handlebars');

// Routes
app.get('/', function(req, res) {
  res.render('index');
});

app.listen(PORT, function() {
  console.log('App running on port ' + PORT);
});
