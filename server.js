'use strict';
 
// Dependencies
 
require('dotenv').config();
const express = require('express');
const cors = require('cors')
const superagent = require('superagent')
const pg = require('pg');
const { response } = require('express');
const methodoverride = require('method-override');
 
// App Set-Up
const app = express();
app.use(cors());
 
// Environmental Variables
const PORT = process.env.PORT || 3000;
const ENV = process.env.ENV;
 
// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));
app.set('view engine', 'ejs');
app.use(methodoverride('_method'));
 
// Database
const DATABASE_URL = process.env.DATABASE_URL;
const client = new pg.Client(DATABASE_URL);
client.connect()
 
// Routes - admin 
app.get('/home',home)
 
// /dashboard-signin - get
// /dashboard - put delete
// /chat/id
// /
 
// Handler
function home(request,response) {
response.render('../views/index')
}



// PORT Listen + Database connection
 
// client.connect().then( function() {
//     app.listen(PORT, () => console.log(`Listening to Port ${PORT}`))
// });


// All Errors

function errorHandler(request,response) {
    response.render('views/error')
}

app.use("*", errorHandler)

app.listen(PORT, () => console.log(`Listening to Port ${PORT}`))