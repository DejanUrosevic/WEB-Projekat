var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Kreiramo šemu komentara
var commentSchema = new Schema({
  autor: { type: Schema.Types.ObjectId, ref: 'Korisnik' },
  tekst: {
    type: String,
    required: true
  },
  createdAt: Date
});

// Predradnje prilikom snimanja
commentSchema.pre('save', function(next) {
  // preuzmemo trenutni datum
  var currentDate = new Date();

  // ako nije postavljena vrednost za createdAt, postavimo je
  if (!this.createdAt)
    this.createdAt = currentDate;

  // predjemo na sledecu funckiju u lancu
  next();
});

// od sheme kreiramo model koji cemo koristiti
var Comment = mongoose.model('Comment', commentSchema);

// publikujemo kreirani model
module.exports = Comment;
