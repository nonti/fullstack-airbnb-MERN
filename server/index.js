const express = require('express');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Place = require('./models/Place');
const download = require('image-downloader')
const cookieParser = require('cookie-parser');
const multer = require('multer');
const fs = require('fs');

require('dotenv').config();
const app = express();

const hashedPassword = bcrypt.genSaltSync(10);
const jwtSecret = 'jwt_secret';


/**Middlewares */
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname+ '/uploads'));
app.use(cors({
  credentials: true,
  origin: 'http://localhost:5173',
}));

mongoose.connect(process.env.MONGODB_URL);
app.get('/test', (req, res) => {
  res.json('test ok')
});

/**Routes */
app.post('/register', async (req, res) =>{
  const {name, email, password} = req.body;
  try {
    const user_doc = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, hashedPassword),
    });
    res.json(user_doc);
  } catch (err) {
    res.status(422).json(err);
  }
  
});

app.post('/signin', async (req, res) => {
  const {email, password} = req.body;
  
  const user_doc = await User.findOne({email});
    if(user_doc){
      const isMatch = bcrypt.compareSync(password, user_doc.password);
      if(isMatch){
        jwt.sign({
          email: user_doc.email, 
          id: user_doc._id, 
          name: user_doc.name,
        }, 
        jwtSecret, {}, (err, token) =>{
          if(err) throw err;
          res.cookie('token', token).json(user_doc)
        });
      }else{
        res.status(422).json('Password unmatched');
      }
    }else{
      res.json('User not found');
    } 
});

app.get('/profile', (req, res) => {
  const {token} = req.cookies;
  if(token){
    jwt.verify(token, jwtSecret,{}, async (err, user_data) =>{
      if(err) throw err
      const {name, email, _id} = await User.findById(user_data.id)
      res.json({name, email, _id});
    })
  }else{
  res.json(null);

  }
});

app.post('/signout', (req, res) => {
  res.cookie('token', '').json(true);
})

app.post('/upload-by-link', async(req, res) => {
  const {link} = req.body;
  const newName = 'photo' + Date.now() + '.jpg'
  await download.image({
    url: link, 
    dest: __dirname + '/uploads/' + newName,
  });
  res.json(newName);
});

const photoMiddleware = multer({dest:'uploads'})
app.post('/upload',photoMiddleware.array('photos', 100) , (req,res) =>{
  const uploadedFiles = [];
  for(let i = 0; i < req.files.length; i++){
    const {path, originalname} = req.files[i];
    const parts = originalname.split('.')
    const ext = parts[parts.length - 1];
    const newPath = path + '.' + ext;
    fs.renameSync(path, newPath);
    uploadedFiles.push(newPath.replace('uploads/', ''))
  }
  res.json(uploadedFiles);
} );

app.post('/places', (req, res) =>{
  const {token} = req.cookies;
  const { title, address,addedPhotos, description, 
    extraInfo, perks, checkIn, checkOut, maxGuests,price,} = req.body;
  jwt.verify(token, jwtSecret,{}, async (err, user_data) =>{
    if(err) throw err;
      const place_doc = await Place.create({
      owner: user_data.id,
      title, address,photos:addedPhotos, description, 
    extraInfo, perks, checkIn, checkOut, maxGuests,price,
    });
    res.json(place_doc);
  });  
});

app.get('/user-places', (req, res) =>{
  const {token} = req.cookies;
  jwt.verify(token, jwtSecret,{}, async (err, user_data) => {
    const {id} = user_data;
    res.json(await Place.find({owner:id}));
  });
});

app.get('/places/:id', async (req,res)=>{
  const {id} = req.params;
  res.json(await Place.findById(id));
});

app.put('/places', async (req, res) => {
  const {token} = req.cookies;
  const { id,title, address,addedPhotos, description, 
    extraInfo, perks, checkIn, checkOut, maxGuests,price,} = req.body;
    jwt.verify(token, jwtSecret,{}, async (err, user_data) => {
      if(err) throw err;
      const place_doc = await Place.findById(id);
      if(user_data.id === place_doc.owner.toString()){
        place_doc.set({
          title, address,photos:addedPhotos, description, 
          extraInfo, perks, checkIn, checkOut, maxGuests,price
        })
        await place_doc.save();
        res.json('ok');
      }
    });
});

app.get('/places', async (req, res) => {
  res.json(await Place.find());
});

app.listen(4001);