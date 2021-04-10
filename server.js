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



app.get('/', handlerhome);
app.post('/userinfo',handleruserinfo);
app.post('/sendmessage',handlersendmessage);
app.get('/getmessage',handlerrecievemessage);
app.post('/signin',handlersignin);
app.post('/dashboard',handlerdashboard);
app.post('/newchatroom',handlernewchatroom);


function handlerhome(request,response){

    response.render('../views/index')

}



//get the user data and insert it in the participants table
function handleruserinfo(request,response){

const{email,name}=request.body;
const userQuery =`INSERT INTO participants (email,name) VALUES ($1,$2);`
const userValues= [email,name];

client.query(userQuery,userValues).then(data =>{
    response.redirect('/chatroom');
}).catch(error=>{
    response.render('../views/error')
})
}



// insert the message inside the messages table and redirect to the handler get messages 
function handlersendmessage(request,response){

    const{message_body}=request.body;
    const userQuery =`INSERT INTO participants (message_body) VALUES ($1);`
    const userValues= [message_body];
    
    client.query(userQuery,userValues).then(data =>{
        response.redirect('/getmessage');
    }).catch(error=>{
        response.render('../views/error')
    }) 
    }



 // get the messages from the messages table and render the message body in the chatroom.ejs (just need to make the template)
 //maybe we need to create an object ???
 function handlerrecievemessage(request,response){

     const{message_body}=request.body;
        const userQuery =`SELECT time,message_body,participant_id FROM participants;`
        const userValues= [message_body];
        
        client.query(userQuery,userValues).then(data =>{
            response.render('./chatroom/chatroom',{data:data.rows[0]});
        }).catch(error=>{
            response.render('../views/error')
        })
        }

//render the dashboard after admins sign in 
function handlerdashboard(request,response){

    const{name}=request.body;
     const userQuery =`SELECT name FROM rooms VALUES($);`
     const userValues= [name];
                 
     client.query(userQuery,userValues).then(data =>{
         response.render('./chatroom/chatroom',{data:data.rows[0]});
         }).catch(error=>{
          response.render('../views/error')
         }) 
         }




//post the admins data in the admins table 
function handlersignin(request,response){

    const{name,password}=request.body;
    const userQuery =`INSERT INTO admins (name,password) VALUES ($1,$2);`
    const userValues= [name,password];
                
    client.query(userQuery,userValues).then(data =>{
        response.redirect('/dashboard');
        }).catch(error=>{
         response.render('../views/error')
        }) 
        }








//to add a new room but still not finish 
function handlernewchatroom(request,response){

    const{name}=request.body;
    const userQuery =`INSERT INTO rooms (name) VALUES ($1,$2);`
    const userValues= [name];

    client.query(userQuery,userValues).then(data =>{
        // response.render('');
        }).catch(error=>{
         response.render('../views/error')
        }) 
    
}





// test routes with test handler functions
// Routes - admin 
// app.get('/home', home)
// app.get('/chatroom', chatRoom)
// app.get('/signIn', signIn)
// app.get('/dashboard', dashBoard)

// // /dashboard-signin - get
// // /dashboard - put delete
// // /chat/id
// // /

// // Handler
// function home(request, response) {
//     response.render('../views/index')
// }

// function chatRoom(request, response) {
//     response.render('../views/chatroom/chatroom')
// }

// function signIn(request, response) {
//     response.render('../views/admin/sign-in')
// }

// function dashBoard(request, response) {
//     response.render('../views/admin/dashboard.ejs')
// }

// PORT Listen + Database connection

// client.connect().then( function() {
//     app.listen(PORT, () => console.log(`Listening to Port ${PORT}`))
// });


// All Errors

function errorHandler(request, response) {
    response.render('../views/error')
}

app.use("*", errorHandler)



client.connect().then(() => {
    app.listen(PORT, () => {
        console.log(`Listening to Port ${PORT}`);
    })
  })
