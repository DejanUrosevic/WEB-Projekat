var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Kreiramo šemu korisnik
var korShema = new Schema({
  ime: {
    type: String,
    required: true
  },
  prezime: {
    type: String,
    required: true
  }, 
  email: {
    type: String,
    required: true,
    unique: true
  },
  lozinka: {
    type: String,
    required: true
  },
  vrsta: String,
  createdAt: Date,
  zadatak: [{ type: Schema.Types.ObjectId, ref: 'Zadatak' }],
  projekti: [{ type: Schema.Types.ObjectId, ref: 'Projekat' }]
});

// Predradnja prilikom memorisanja
korShema.pre('save', function(next) {
  this.vrsta = 'korisnik';

  // preuzmemo trenutni datum
  var currentDate = new Date();

  // Postavimo datum kriranja
  if (!this.createdAt)
    this.createdAt = currentDate;

  // predjemo na sledecu funckiju u lancu
  next();
});

// od sheme kreiramo model koji cemo koristiti
var Korisnik = mongoose.model('Korisnik', korShema);

// publikujemo kreirani model
module.exports = Korisnik;
