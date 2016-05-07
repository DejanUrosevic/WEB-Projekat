var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// kreiramo novu shemu
var zadatakSchema = new Schema({
  oznaka: { 
  	type: String,
  	required: true,
    unique: true
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
  prioritet: {
  	type: String, 
  	enum: ['Blocker', 'Critical', 'Major', 'Minor', 'Trivial']
  },
  izmeneZadatka: [{ type: Schema.Types.ObjectId, ref: 'Zadatak' }],
  status: 
  {
    type: String, 
    enum: ['To Do', 'In Progress', 'Verify', 'Done'],
    default: 'To Do',
    required: true
  }
  
});

// prilikom snimanja se postavi datum
zadatakSchema.pre('save', function(next) 
{
  // preuzmemo trenutni datum
  var currentDate = new Date();
  

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
