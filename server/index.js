const express = require('express');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const app = express();

const hashedPassword = bcrypt.genSaltSync(10);
const jwtSecret = 'jwt_secret';

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin: 'http://localhost:5173',
}));

mongoose.connect(process.env.MONGODB_URL);
app.get('/test', (req, res) => {
  res.json('test ok')
});


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


app.listen(4001);