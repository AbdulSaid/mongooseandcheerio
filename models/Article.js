// Require mongoose
var mongoose = require('mongoose');
// Create a Schema
var Schema = mongoose.Schema;

var ArticleScheme = new Schema({
  title: {
    type: String,
    required: false,
    unique: true
  },
  summary: {
    type: String,
    required: false,
    unique: true
  },
  link: {
    type: String,
    required: false,
    unique: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  saved: {
    type: Boolean,
    default: false
  },
  notes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Note'
    }
  ]
});

// Creates out model from the above schema, using mongoose's model method
var Article = mongoose.model('Article', ArticleScheme);

// Export the Article model
module.exports = Article;
