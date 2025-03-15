const mongoose = require('mongoose')

const beerScheme = new mongoose.Schema({
    naziv:{ type:String, required:true},
    cijena:{ type:Number, required:true},
    postotak_alkohola:{ type:Number, required:true},
    boja:{ type:String},
    tip:{ type:String, required:true},
    opis:{ type:String},
    slika:{ type:String},
    manufacturer:{ type: mongoose.Schema.Types.ObjectId, ref: 'Manufacturer', required:true}
})

const Beer = mongoose.model('Beer',beerScheme,'beer')
module.exports = Beer