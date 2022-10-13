const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const stuffRoutes = require('./routes/stuff');
const userRootes = require('./routes/user');

const app = express();

app.use(express.json());

//Connection base de donné 
mongoose.connect('mongodb+srv://Gabain:Gabain1836@cluster0.kvvgyfk.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

mongoose.set("strict", "throw");

//CORS
app.use((request, response, next) => {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

//rootes par default
app.use('/api', stuffRoutes);
app.use(userRootes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;