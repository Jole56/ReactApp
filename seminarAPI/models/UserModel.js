const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userScheme = new mongoose.Schema({
    username:{ type: String, required: true, unique:true},
    password:{ type: String, required: true},
    role: { type: String, enum: ['admin','user'], default: 'user'},
    cart: [
        {
          beerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Beer' },
          quantity: { type: Number, default: 1 },
        }
      ],
    favorites: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Beer' }
      ]
})

userScheme.pre('save',async function (next) {
    try{
        if(!this.isModified('password'))
            return next
        const saltRounds = 10
        this.password = await bcrypt.hash(this.password,saltRounds)
        next()
    }
    catch(err){
        next(err)
    }
})

const User = mongoose.model('User',userScheme,'user')
module.exports = User