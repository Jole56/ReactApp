const mongoose = require('mongoose');
const express = require('express') 
const cors = require('cors')
const Manufacturer = require('./models/ManufacturerModel')
const Beer = require('./models/BeerModel')
const User = require('./models/UserModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const verifyToken = require('./middlewares/authMiddleware');
const isAdmin = require('./middlewares/adminMiddleware');
require('dotenv').config()
const secret = process.env.secret

const app = express()
const port = process.env.PORT || 3000
const db = mongoose.connect('mongodb://localhost:27017/craftBeers')

app.use(cors())
app.use(express.json())
const beerRouter = express.Router()
const userRouter = express.Router()
const cartRouter = express.Router()
const favoritesRouter = express.Router()
app.use('/user',userRouter)
app.use('/craftbeer',beerRouter)
app.use('/cart',cartRouter)
app.use('/favorites',favoritesRouter)

app.get('/',(req,res)=>{
    res.send("Welcome to my API!!!")
})

beerRouter.get('/allmanufacturers', verifyToken, async (req,res) => {
    try{
        const allmanufacturers = await Manufacturer.find()
        res.status(200).json(allmanufacturers)
    } catch(err){
        console.log("Error: "+err)
        res.status(500).json({message: 'Greška prilikom dohvata podataka.'})
    }
})

beerRouter.get('/allbeers', verifyToken, async (req,res) => {
    try{
        const allbeers = await Beer.find()
        res.status(200).json(allbeers)
    } catch(err){
        console.log("Error: "+err)
        res.status(500).json({message: 'Greška prilikom dohvata podataka.'})
    }
})

beerRouter.get('/products/:manufacturerId', verifyToken, async (req,res)=>{
    try{
        const { manufacturerId } = req.params
        const beers = await Beer.find({ manufacturer: manufacturerId})
        if(!beers.length) {
            return res.status(404).json({ message: 'No products found for this manufacturer.'})
        }
        
        res.status(200).json(beers)
    } catch(err) {
        console.log("Error: "+err)
        res.status(500).json({ message: 'Greška pri dohvatu podataka.'})
    }
})

userRouter.post('/add', async (req,res) =>{
    const {username, password, role} = req.body

    try{
        const existingUser = await User.findOne({username})
        if (existingUser){
            return res.status(400).json({message: 'Korisnicko ime vec postoji.'})
        }

        const newUser = new User({
            username,
            password,
            role,
        })

        await newUser.save()
        res.status(201).json({message: 'Korisnik uspjesno dodan.'})

    }catch(err){
        console.log(err)
        res.status(500).json({message: 'Greska prilikom dodavanja korisnika.' })       
    }
})

userRouter.post('/login',async (req,res) =>{
    const {username,password} = req.body

    try{
        console.log("Received login request with:", { username, password });
        const user = await User.findOne({username})
        console.log("User fetched from database:", user);
        if (!user){
            return res.status(401).json({message: "Invalid username or password."})
        }

        const isPasswordValid = await bcrypt.compare(password,user.password)
        if(!isPasswordValid){
            return res.status(401).json({message: "Invalid username or password."})
        }
        const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, secret)
        res.json({ token, user: { id: user._id, username: user.username, role: user.role }})
    } catch(err){
        res.status(500).json({ message: "Server error"})
    }
})

beerRouter.post('/addmanufacturer', verifyToken, isAdmin, async (req,res) =>{
    const { naziv, drzava, godina_osnivanja, opis } = req.body
    if (!naziv || !drzava || !godina_osnivanja || !opis) {
        return res.status(400).json({ message: "Sva polja su obavezna!" });
    }
    try{
        const manufacturer = new  Manufacturer({ naziv,drzava,godina_osnivanja,opis })
        await manufacturer.save()
        res.status(201).json({ message: "Manufacturer added succesfully"})
    } catch(err){
        console.error("Error adding manufacturer: ",err)
        res.status(500).json({ message: "Greska pri dodavanju proizvodaca!"})
    }
})

beerRouter.delete('/deletemanu/:id', verifyToken, isAdmin, async (req,res)=>{
    const { id } = req.params
    const beersWithThatManufacturer = await Beer.findOne({manufacturer: id})
    if (beersWithThatManufacturer){
        return res.status(400).json({message: "Proizvodac se ne moze trenutno obrisati jer postoje proizvodi vezani uz njega! "})
    }
    try{
        const deletedManufacturer = await Manufacturer.findByIdAndDelete(id)
        if (!deletedManufacturer){
            return res.status(400).json({message: "Proizvodac nije pronaden!"})
        }

        res.status(200).json({message: "Proizvodac uspjesno obrisan."})
    }catch(err){
        res.status(500).json({message: "Greska prilikom brisanja proizvodaca."})
    }
})

beerRouter.delete('/deleteproduct/:id', verifyToken, isAdmin, async (req,res)=>{
    const { id } = req.params
    try{
        const deletedProduct = await Beer.findByIdAndDelete(id)
        if (!deletedProduct){
            return res.status(400).json({message: "Proizvod nije pronaden!"})
        }

        res.status(200).json({message: "Proizvod uspjesno obrisan."})
    }catch(err){
        res.status(500).json({message: "Greska prilikom brisanja proizvoda."})
    }
})

beerRouter.post('/addproduct', verifyToken, isAdmin, async (req,res) =>{
    const { naziv, cijena, postotak_alkohola, boja, tip, opis, slika, manufacturer } = req.body
    if (!naziv || !cijena || !postotak_alkohola || !boja || !tip || !opis || !slika || !manufacturer) {
        return res.status(400).json({ message: "Sva polja su obavezna!" });
    }
    try{
        const beer = new  Beer({ naziv, cijena, postotak_alkohola, boja, tip, opis, slika, manufacturer })
        await beer.save()
        res.status(201).json({ message: "Product added succesfully"})
    } catch(err){
        console.error("Error adding product: ",err)
        res.status(500).json({ message: "Greska pri dodavanju proizvoda!"})
    }
})


beerRouter.get('/beer/:id',  async (req,res) =>{
    const { id } = req.params
    try{
        const beer = await Beer.findById(id)
        if(!beer){
            return res.status(404).json({message:"Proizvod nije pronađen"})
        }
        res.json(beer)
    }catch(err){
        res.status(500).json({message:"Greška na serveru:("})
    }
})

cartRouter.get('/', verifyToken, async (req,res)=>{
    try{
        const userId = req.user.id
        const user = await User.findById(userId).populate('cart.beerId')
        if(!user){
            return res.status(404).json({message:"Korisnik ne postoji."})
        }
        res.json(user.cart)
    }catch(err){
        res.status(500).json({message:"Server error:"+ err.message})
    }
})

cartRouter.post('/add', verifyToken, async (req,res) =>{
    try{
        const userId = req.user.id
        const { beerId } = req.body
        
        const foundBeer = await Beer.findById(beerId)
        if(!foundBeer){
            return res.status(404).json({message:"Pivo ne postoji!"})
        }
        const user = await User.findById(userId)
        if(!user){
            return res.status(404).json({message:"Korisnik ne postoji!"})
        }

        const existingItem = user.cart.find(item => item.beerId.equals(beerId))
        if(existingItem){
            existingItem.quantity += 1
        }else{
            user.cart.push({ beerId, quantity: 1})
        }
        await user.save()
        const refreshedUser = await User.findById(user._id).populate('cart.beerId');
        res.json({message:"Proizvod dodan u košaricu.",cart: refreshedUser.cart})
    }catch(err){
        console.error("Greška pri POST /cart/add:", err);
        res.status(500).json({message: "Server error:"+ err.message})
    }
})

cartRouter.delete('/:beerId', verifyToken, async(req, res) => {
    try{
        const userId = req.user.id
        const { beerId } = req.params

        const user = await User.findById(userId)
        if(!user){
            return res.status(404).json({message:"Korisnik ne postoji."})
        }
        user.cart = user.cart.filter(item => !item.beerId.equals(beerId))
        await user.save()
        const refreshedUser = await User.findById(user._id).populate('cart.beerId');
        res.json({message:"Proizvod uklonjen iz košarice.", cart: refreshedUser.cart})
    }catch(err){
        res.status(500).json({message:"Server error:",err})
    }
})

cartRouter.post('/checkout', verifyToken, async (req, res) =>{
    try {
        const user = await User.findById(req.user.id)
        if (!user){
            return res.status(404).json({message:"Korisnik ne postoji"})
        }
        user.cart = []
        await user.save()
        res.json({message:"Checkout uspješan, košarica je ispražnjena.",cart: user.cart})
    } catch(err){
        res.status(500).json({message:"Server error",err})
    }
})

cartRouter.patch('/increase/:beerId', verifyToken, async (req,res)=>{
    try{
        const user = await User.findById(req.user.id)
        if(!user) return res.status(404).json({message:"Korisnik ne postoji"})
        const beerId = req.params.beerId
        const cartItem = user.cart.find(item=>item.beerId.equals(beerId))
        if(!cartItem) return res.status(404).json({message:"Artikl nije u košarici."})
        cartItem.quantity += 1
        await user.save()
        const refreshedUser = await User.findById(user._id).populate('cart.beerId');
        res.json({message:"Uspješno povećana količina", cart: refreshedUser.cart})
        }catch(err){
            res.status(500).json({message:"server error",err})
        }
})

cartRouter.patch('/decrease/:beerId', verifyToken, async (req,res)=>{
    try{
        const user = await User.findById(req.user.id)
        if(!user) return res.status(404).json({message:"Korisnik ne postoji"})
        const beerId = req.params.beerId
        const cartItem = user.cart.find(item=>item.beerId.equals(beerId))
        if(!cartItem) return res.status(404).json({message:"Artikl nije u košarici."})
        if(cartItem.quantity > 1){
            cartItem.quantity -= 1
        }
        await user.save()
        const refreshedUser = await User.findById(user._id).populate('cart.beerId');
        res.json({message:"Uspješno povećana količina", cart: refreshedUser.cart})
        }catch(err){
            res.status(500).json({message:"server error",err})
        }
})

favoritesRouter.get('/',verifyToken, async (req,res)=>{
    try {
        const user = await User.findById(req.user.id).populate('favorites');
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.json(user.favorites);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
})

favoritesRouter.post('/add', verifyToken, async (req, res) => {
    try {
      const { beerId } = req.body;
      const beer = await Beer.findById(beerId);
      if (!beer) {
        return res.status(404).json({ message: 'Beer not found' });
      }
  
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      if (!user.favorites.includes(beerId)) {
        user.favorites.push(beerId);
        await user.save();
      }

      const refreshedUser = await User.findById(req.user.id).populate('favorites');
      res.json({ message: 'Dodano u favorite', favorites: refreshedUser.favorites });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  })

favoritesRouter.delete('/:beerId', verifyToken, async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "Korisnik ne postoji" });
      }
      user.favorites = user.favorites.filter(
        (favId) => !favId.equals(req.params.beerId)
      );
      await user.save();
      const refreshedUser = await User.findById(req.user.id).populate('favorites');
      return res.json({ favorites: refreshedUser.favorites });
    } catch (err) {
      console.error("Greška pri brisanju iz favorites:", err);
      return res.status(500).json({ message: err.message });
    }
  })

beerRouter.put('/manufacturers/:id', verifyToken, isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { naziv, drzava, godina_osnivanja, opis } = req.body;
      const updated = await Manufacturer.findByIdAndUpdate(id,
        { naziv, drzava, godina_osnivanja, opis },
        { new: true }
      );
      if (!updated) {
        return res.status(404).json({ message: "Proizvođač nije pronađen" });
      }
      res.json(updated);
    } catch (err) {
      res.status(500).json({ message: "Greška pri updateu: " + err.message });
    }
  });
  

beerRouter.put('/products/:id', verifyToken, isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { naziv, cijena, postotak_alkohola, boja, tip, opis, slika, manufacturer } = req.body;
      const updated = await Beer.findByIdAndUpdate(
        id,
        { naziv, cijena, postotak_alkohola, boja, tip, opis, slika, manufacturer },
        { new: true }
      );
      if (!updated) {
        return res.status(404).json({ message: "Proizvod nije pronađen" });
      }
      res.json(updated);
    } catch (err) {
      res.status(500).json({ message: "Greška pri updateu: " + err.message });
    }
  })
  


beerRouter.get('/manufacturers/:id', verifyToken, isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const manufacturer = await Manufacturer.findById(id);
      if (!manufacturer) {
        return res.status(404).json({ message: 'Proizvođač nije pronađen' });
      }
      res.json(manufacturer);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Greška na serveru.' });
    }
  })


beerRouter.get('/edit/products/:id', verifyToken, async (req, res) => {
    try {
      const { id } = req.params;
      console.log("ID:", req.params.id)
      const product = await Beer.findById(id).populate('manufacturer');
      if (!product) {
        return res.status(404).json({ message: 'Proizvod nije pronađen' });
      }
      res.json(product);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Greška na serveru.' });
    }
  })
  

beerRouter.get('/api/beers/expensive', async (req, res) => {
    try {
        const beers = await Beer.find({ cijena: { $gt: 2.0 } });
        res.json(beers);
    } catch (error) {
        console.error('Error fetching beers:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



userRouter.get('/alladmin', async (req,res)=>{
    try{
        const korisnik = await User.find({role:"admin"})
        res.json(korisnik)
    }catch(err){
        res.status(500).json({message: "Greska"})
    }
})

userRouter.get('/allusers', async (req,res)=>{
    try{
        const korisnik = await User.find({role:"user"})
        res.json(korisnik)
    }catch(err){
        res.status(500).json({message: "Greska"})
    }
})

userRouter.get('/alladmins', async (req,res)=>{
    try{
        const admin = await User.find({role:"admin"})
        res.json(admin)
    }catch(err){
        res.status(500).json({message: "Greska"})
    }
})
  
app.listen(port,()=>{
    console.log("Running on port "+port)
})