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
var Article = require('./models/Article');
var Note = require('./models/Note');

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
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Handlebars
app.engine(
  'handlebars',
  exphbs({
    defaultLayout: 'main',
    partialsDir: path.join(__dirname, '/views/layouts/partials')
  })
);
app.set('view engine', 'handlebars');

// Connect to the Mongo DB
mongoose.connect(
  'mongodb://localhost/mongoarticle',
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
// require('./routes/htmlRoutes')(app);
app.get('/', function(req, res) {
  Article.find({ saved: false }, function(error, data) {
    var hbsObject = {
      article: data
    };
    console.log(hbsObject);
    res.render('index');
  });
});

app.get('/saved', function(req, res) {
  Article.find({ saved: true })
    .populate('notes')
    .exec(function(error, articles) {
      var hbsObject = {
        article: articles
      };
      res.render('saved', hbsObject);
    });
});

app.get('/scrape', function(req, res) {
  axios.get('https://www.nytimes.com/').then(function(response) {
    // Load to cheerio
    var $ = cheerio.load(response.data);

    $('article').each(function(i, element) {
      // Save an empty result object
      var result = {};

      // Add the title and summary of every link, and save them as properties of the result object
      result.title = $(this)
        .children('h2')
        .text();
      result.summary = $(this)
        .children('.summary')
        .text();
      result.link = $(this)
        .children('h2')
        .children('a')
        .attr('href');

      // Using our Article model, create a new entry
      // This effectively passes the result object to the entry (and the title and link)
      var entry = new Article(result);

      // Now, save that entry to the db
      entry.save(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        // Or log the doc
        else {
          console.log(doc);
        }
      });
    });
    res.send('scrape complete');
    // Grab every article tag
    // $('div.css-6p6lnl').each(function(i, element) {
    //   var result = {};
    //   var title = $(element)
    //     .children('a')
    //     .children('div')
    //     .children('h2')
    //     .text();
    //   var link = $(element)
    //     .children('a')
    //     .attr('href');

    //   var summary = $(element)
    //     .children('a')
    //     .children('p')
    //     .text();
    //   // if sum then push...
    //   result.push({
    //     title: title,
    //     link: link,
    //     summary: summary
    //   });
    //   console.log(result);
    // });
  });
});

// This will get the articles we scraped from the mongoDB
app.get('/articles', function(req, res) {
  // Grab every doc in the Articles array
  Article.find({}, function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Or send the doc to the browser as a json object
    else {
      res.json(doc);
    }
  });
});
// Grab an article by it's ObjectId
app.get('/articles/:id', function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  Article.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate('note')
    // now, execute our query
    .exec(function(error, doc) {
      // Log any errors
      if (error) {
        console.log(error);
      }
      // Otherwise, send the doc to the browser as a json object
      else {
        res.json(doc);
      }
    });
});

// Save an article
app.post('/articles/save/:id', function(req, res) {
  // Use the article id to find and update its saved boolean
  Article.findOneAndUpdate({ _id: req.params.id }, { saved: true })
    // Execute the above query
    .exec(function(err, doc) {
      // Log any errors
      if (err) {
        console.log(err);
      } else {
        // Or send the document to the browser
        res.send(doc);
      }
    });
});

// Delete an article
app.post('/articles/delete/:id', function(req, res) {
  // Use the article id to find and update its saved boolean
  Article.findOneAndUpdate({ _id: req.params.id }, { saved: false, notes: [] })
    // Execute the above query
    .exec(function(err, doc) {
      // Log any errors
      if (err) {
        console.log(err);
      } else {
        // Or send the document to the browser
        res.send(doc);
      }
    });
});

// Create a new note
app.post('/notes/save/:id', function(req, res) {
  // Create a new note and pass the req.body to the entry
  var newNote = new Note({
    body: req.body.text,
    article: req.params.id
  });
  console.log(req.body);
  // And save the new note the db
  newNote.save(function(error, note) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise
    else {
      // Use the article id to find and update it's notes
      Article.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { notes: note } }
      )
        // Execute the above query
        .exec(function(err) {
          // Log any errors
          if (err) {
            console.log(err);
            res.send(err);
          } else {
            // Or send the note to the browser
            res.send(note);
          }
        });
    }
  });
});

// Delete a note
app.delete('/notes/delete/:note_id/:article_id', function(req, res) {
  // Use the note id to find and delete it
  Note.findOneAndRemove({ _id: req.params.note_id }, function(err) {
    // Log any errors
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      Article.findOneAndUpdate(
        { _id: req.params.article_id },
        { $pull: { notes: req.params.note_id } }
      )
        // Execute the above query
        .exec(function(err) {
          // Log any errors
          if (err) {
            console.log(err);
            res.send(err);
          } else {
            // Or send the note to the browser
            res.send('Note Deleted');
          }
        });
    }
  });
});

app.listen(PORT, function() {
  console.log('App running on port ' + PORT);
});
