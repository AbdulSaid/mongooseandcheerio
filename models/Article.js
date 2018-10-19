var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ArticleScheme = new Schema({
  headline: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  saved: {
    type: Boolean,
    default: false
  },
  note: {
    type: Schema.Types.ObjectId,
    ref: 'Note'
  }
});

// Creates out model from the above schema, using mongoose's model method
var Article = mongoose.model('Article', ArticleScheme);

// Export the Article model
module.exports = Article;
