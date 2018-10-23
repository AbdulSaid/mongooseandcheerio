// Require in models
var db = require('../models');

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require('axios');
var cheerio = require('cheerio');

var Article = require('../models/Article');
var Note = require('../models/Note');

module.exports = function(app) {
  // Routes
  app.get('/', function(req, res) {
    Article.find({ saved: false }, function(error, data) {
      var hbsObject = {
        article: data
      };
    });
    console.log(hbsObject);
    res.render('index');
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
};
