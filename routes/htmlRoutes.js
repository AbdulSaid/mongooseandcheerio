// Require in models
var db = require('../models');

module.exports = function(app) {
  // Routes
  app.get('/', function(req, res) {
    res.render('index');
  });

  app.get('/saved', function(req, res) {
    res.render('saved');
  });
};
