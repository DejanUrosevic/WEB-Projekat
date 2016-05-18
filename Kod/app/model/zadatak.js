var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Zadatak = require(__dirname + '/../model/zadatak');

// Kriramo šemu zadatka
var zadatakSchema = new Schema({
  oznaka: { 
  	type: String,
  	required: true
  },
  redni_broj: {
  	type: Number,
  	required: true
  },
  naslov: {
  	type: String,
    required: true
  },
  opis: {
  	type: String,
    required: true
  },
  autor: { type: Schema.Types.ObjectId, ref: 'Korisnik' },
  korisnik: { type: Schema.Types.ObjectId, ref: 'Korisnik' },
  createdAt: Date,
  updatedAt: Date,
  komentari: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  prioritet: {
  	type: String, 
  	enum: ['Blocker', 'Critical', 'Major', 'Minor', 'Trivial']
  },
  izmeneZadatka: [Zadatak],																	// Moglo bi drugačije // Ovde se čuvajuKompletne izmene a ne reference
  status: {
    type: String,
    default: 'To Do',
    required: true
  }
});

// Predradnje prilikom memorisanja
zadatakSchema.pre('save', function(next) {
  // preuzmemo trenutni datum
  var currentDate = new Date();
  
  this.updatedAt = currentDate;

  // Postavimo datum kriranja
  if (!this.createdAt)
    this.createdAt = currentDate;

  // predjemo na sledecu funckiju u lancu
  next();
});

// od sheme kreiramo model koji cemo koristiti
var Zadatak = mongoose.model('Zadatak', zadatakSchema);

// publikujemo kreirani model
module.exports = Zadatak;
