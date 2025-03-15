const mongoose = require('mongoose');

const manufacturerScheme = new mongoose.Schema({
    naziv:{ type:String, required: true },
    godina_osnivanja:{ type:Number, required: true },
    drzava:{ type:String, required: true },
    opis:{ type:String}
})


const Manufacturer = mongoose.model('Manufacturer',manufacturerScheme,'manufacturer')

module.exports = Manufacturer