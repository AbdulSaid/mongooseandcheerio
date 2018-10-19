// Require in models
var db = require('../models');

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require('axios');
var cheerio = require('cheerio');

module.exports = function(app) {
  // Routes
  app.get('/', function(req, res) {
    res.render('index');
  });

  app.get('/saved', function(req, res) {
    res.render('saved');
  });

  app.get('/scrape', function(req, res) {
    axios.get('https://www.nytimes.com/').then(function(response) {
      // Load to cheerio
      var $ = cheerio.load(response.data);

      var result = [];
      // Grab every article tag
      $('div.css-6p6lnl').each(function(i, element) {
        var title = $(element)
          .children('a')
          .children('div')
          .children('h2')
          .text();
        var link = $(element)
          .children('a')
          .attr('href');

        var summary = $(element)
          .children('a')
          .children('div')
          .children('p')
          .text();

        result.push({
          title: title,
          link: link,
          summary: summary
        });
        console.log(result);
      });
    });
  });
};
