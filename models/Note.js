var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// NoteSchema object
var NoteSchema = new Schema({
  note: String
});

var Note = mongoose.model('Note', NoteSchema);

module.exports = Note;
