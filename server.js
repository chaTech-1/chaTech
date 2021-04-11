'use strict';

// Dependencies

require('dotenv').config();
const express = require('express');
const cors = require('cors')
const superagent = require('superagent')
const pg = require('pg');
const { response } = require('express');
const methodoverride = require('method-override');
// io
// bycrypt

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


// endpoints
app.get('/', renderhome);
app.post('/',participantInfoHandler)
app.get('/signin',renderSignin)
app.post('/signin',handlerSignin);
app.get('/dashboard',renderDashboard);
app.post('/dashboard',addRoomToDashboard);
app.put('/dashboard',editRoomInDashboard);
app.delete('/dashboard',deleteRoomFromDashboard);
app.get('/chatrooms',renderChatRoom);


// Call-Back Functions

function renderhome(request,response){
    response.render('../views/index')
}

//Sign-In - Admin
function renderSignin(request,response) {
    response.render('../views/admin/sign-in')
}

function handlerSignin(request,response){
    // bycrypt - pacakge
    // AUTHENTICATION REQUIRED
    const{name,password}=request.body;
    const sqlQuery =`INSERT INTO admins (name,password) VALUES ($1,$2);`
    const safeValues= [name,password];
                
    client.query(sqlQuery,safeValues).then( function() {
        response.redirect('/dashboard');
    }).catch((error)=>{
            errorHandler(error, response)
        }) 
        }

// Dashboard

function renderDashboard(request,response) {
    response.render('../views/admin/dashboard')
}

// Add a chat room 
function addRoomToDashboard(request,response) {
    
}
// Edit a chat room
function editRoomInDashboard(request,response) {
    
}
// Delete a chat room 
function deleteRoomFromDashboard(request,response) {
    
}

// Chat Room 

function renderChatRoom(request, response) {
    response.render('../views/chatroom/chatroom')
}

// Participants

function participantInfoHandler(request,response){
const{name,email}=request.body;
const sqlQuery =`INSERT INTO participants(name,email) VALUES($1,$2);`
const safeValues= [name,email];
// Rooms will be rendered 
client.query(sqlQuery,safeValues).then(data =>{
    response.redirect(`/chatrooms`);
}).catch((error)=>{
    errorHandler(error, response)
})
}

// Messages 

// Render Chat Thread

// Post Message

// Delete Message

// Edit Message






// -----------------------------------------------------------------------------------------------------------------------

// app.post('/userinfo',handleruserinfo);
// app.post('/sendmessage',handlersendmessage);
// app.get('/getmessage',handlerrecievemessage);
// app.post('/dashboard',handlerdashboard);
// app.post('/newchatroom',handlernewchatroom);

//get the user data and insert it in the participants table
// function handleruserinfo(request,response){

// const{email,name}=request.body;
// const userQuery =`INSERT INTO participants(email,name) VALUES($1,$2);`
// const userValues= [email,name];

// client.query(userQuery,userValues).then(data =>{
//     response.redirect('/chatroom');
// }).catch(error=>{
//     response.render('../views/error')
// })
// }



// insert the message inside the messages table and redirect to the handler get messages 
// function handlersendmessage(request,response){

//     const{message_body}=request.body;
//     const userQuery =`INSERT INTO participants (message_body) VALUES ($1);`
//     const userValues= [message_body];
    
//     client.query(userQuery,userValues).then(data =>{
//         response.redirect('/getmessage');
//     }).catch(error=>{
//         response.render('../views/error')
//     }) 
//     }



 // get the messages from the messages table and render the message body in the chatroom.ejs (just need to make the template)
 //maybe we need to create an object ???
//  function handlerrecievemessage(request,response){

//      const{message_body}=request.body;
//         const userQuery =`SELECT time,message_body,participant_id FROM participants;`
//         const userValues= [message_body];
        
//         client.query(userQuery,userValues).then(data =>{
//             response.render('./chatroom/chatroom',{data:data.rows[0]});
//         }).catch(error=>{
//             response.render('../views/error')
//         })
//         }

//render the dashboard after admins sign in 
// function handlerdashboard(request,response){

//     const{name}=request.body;
//      const userQuery =`SELECT name FROM rooms VALUES($);`
//      const userValues= [name];
                 
//      client.query(userQuery,userValues).then(data =>{
//          response.render('./chatroom/chatroom',{data:data.rows[0]});
//          }).catch(error=>{
//           response.render('../views/error')
//          }) 
//          }
//to add a new room but still not finish 
// function handlernewchatroom(request,response){

//     const{name}=request.body;
//     const userQuery =`INSERT INTO rooms (name) VALUES ($1,$2);`
//     const userValues= [name];

//     client.query(userQuery,userValues).then(data =>{
//         // response.render('');
//         }).catch(error=>{
//          response.render('../views/error')
//         }) 
    
// }




// -----------------------------------------------------------------------------------------------------------------------

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
