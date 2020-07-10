const express = require('express');
const path = require('path');
const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv/config');
const userRoutes = require('./routes/api/users.js');

const app = express();

// using body parser
app.use(express.json());
app.use(express.urlencoded({extended:false}));

// using morgan
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

// using api routes
app.use('/users',userRoutes);

// connecting to mongo
mongoose.connect(process.env.MONGO_URI,{useNewUrlParser: true,useUnifiedTopology: true });

// checking if mongo is connected
mongoose.connection.on('connected',()=>{
    console.log('mongoose is connected');
});

// applying 404 page
app.use((req,res) => {
    res.status(404).send("Not Found");
});

// server port
const PORT = process.env.PORT || 5000;

// start listening
app.listen(PORT,()=>{
    console.log(`Server started on PORT: ${PORT}`);
});