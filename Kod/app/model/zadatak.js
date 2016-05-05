var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// kreiramo novu shemu
var zadatakSchema = new Schema({
  oznaka: { 
  	type: String,
  	ref: 'Projekat.oznaka'
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
  komentari: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  status: {
  	type: String, 
  	enum: ['To Do', 'In Progress', 'Verify', 'Done'],
  	required: true
  },
  prioritet: {
  	type: String, 
  	enum: ['Blocker', 'Critical', 'Major', 'Minor', 'Trivial']
  },
  izmeneZadatka: [{ type: Schema.Types.ObjectId, ref: 'Zadatak' }]
  
});

// prilikom snimanja se postavi datum
zadatakSchema.pre('save', function(next) 
{
  // preuzmemo trenutni datum
  var currentDate = new Date();
  this.status = 'To Do';

  // postavimo trenutni datum poslednju izmenu
  if (!this.createdAt)
    this.createdAt = currentDate;

  // predjemo na sledecu funckiju u lancu
  next();
});

// od sheme kreiramo model koji cemo koristiti
var Zadatak = mongoose.model('Zadatak', zadatakSchema);

// publikujemo kreirani model
module.exports = Zadatak;
