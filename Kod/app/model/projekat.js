var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// kreiramo novu shemu
var projekatShema = new Schema({
  naziv: {
    type: String,
    required: true
  },
  oznaka: {
  	type: String,
    required: true,
    unique: true
  },
  createdAt: Date,
  brojZadataka: Number,
  zadatak: [{ type: Schema.Types.ObjectId, ref: 'Zadatak' }],
  korisnici: [{ type: Schema.Types.ObjectId, ref: 'Korisnik' }]
});

// prilikom snimanja se postavi datum
projekatShema.pre('save', function(next) 
{
  // preuzmemo trenutni datum
  var currentDate = new Date();

  // postavimo trenutni datum poslednju izmenu
  if (!this.createdAt)
    this.createdAt = currentDate;
  this.brojZadataka = this.zadatak.length+1;
  // predjemo na sledecu funckiju u lancu
  next();
});

// od sheme kreiramo model koji cemo koristiti
var Projekat = mongoose.model('Projekat', projekatShema);

// publikujemo kreirani model
module.exports = Projekat;
