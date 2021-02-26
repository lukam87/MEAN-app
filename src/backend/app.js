const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');


const postRoutes = require('./models/routes/posts');
const userRoutes = require('./models/routes/user')

const app = express();


mongoose.connect(`mongodb+srv://lukam87:${process.env.MONGO_ATLAS_PW}@cluster0.p8o9q.mongodb.net/node-angular?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=> {
  console.log('Conected to database')
})
.catch(() => {
  console.log('Connection failed!');
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use('/backend/images', express.static(path.join('src/backend/images')))

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Blob, Authorization ');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS')
  next()
})

app.use('/api/posts',postRoutes);
app.use('/api/user',userRoutes);

module.exports = app