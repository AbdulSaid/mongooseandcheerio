// Require mongoose
var mongoose = require('mongoose');
// Create a schema class
var Schema = mongoose.Schema;

// NoteSchema object
var NoteSchema = new Schema({
  body: {
    type: String
  },
  article: {
    type: Schema.Types.ObjectId,
    ref: 'Article'
  }
});

var Note = mongoose.model('Note', NoteSchema);

module.exports = Note;
