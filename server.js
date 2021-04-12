'use strict';

// Dependencies

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const pg = require('pg');
const { response } = require('express');
const methodoverride = require('method-override');
const bcrypt = require('bcrypt');

// body parser - 
// const { emit } = require("process");
// const bodyParser = require('body-parser')
// app.use(bodyParser.json())
// app.use(
//   bodyParser.urlencoded({
//     extended: true,
//   })
// )
// App Set-Up
const app = express();
app.use(cors());
// Database
const DATABASE_URL = process.env.DATABASE_URL;
const client = new pg.Client(DATABASE_URL);

// pool
const Pool = require("pg").Pool;
const pool = new pg.Pool({
  user: "aseelalzweri",
  host: "localhost",
  database: "chatapp",
  password: "SoftDev5060*",
  port: 5432,
});

// socket-io

const server = require("http").createServer(app);
const socket_io = require('socket.io')(server, {
  cors: {
     origin: "http://localhost:3000",
     methods: ["GET", "POST"],
  },
});



// Environmental Variables
const PORT = process.env.PORT || 3000;
const ENV = process.env.ENV;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));
app.set('view engine', 'ejs');
app.use(methodoverride('_method'));


// endpoints
app.get('/', renderhome);
// app.post('/', participantInfoHandler)
app.get('/signin', renderSignin)
app.post('/signin', handlerSignin);
app.get('/dashboard', renderDashboard);
app.post('/dashboard', addRoomToDashboard);
app.put('/dashboard/:roomid', editRoomInDashboard);
app.delete('/dashboard/:roomid', deleteRoomFromDashboard);
app.get('/chatrooms/:roomid/:participantid', renderChatRoom);
app.post('/', saveParticipantInfo);
app.get('/about', renderAbout);
app.post('/chatrooms/:roomid/:participantid', sendMSG);
// app.get('/chatrooms/:participantid/:roomid',receiveMSG);


// Call-Back Functions

// Messages

// send message using client

// function sendMSG(request,response) {
// const roomId =  request.params.roomid;
// const participantId =  request.params.participantid;
// const messageBody = request.body.message;
// // RETURNING messageid,time
// const sqlQuery = `INSERT INTO messages( messagebody, roomid, participantid) VALUES($1, $2, $3) RETURNING messageid,time,messagebody,participantid;`
// const safeValues = [messageBody,roomId,participantId]
// console.log(safeValues)
// client.query(sqlQuery,safeValues).then( (result)=> {
//   console.log(result.rows)
//  response.status(201).send(result.rows);
//  })
// }

// send message using pool

function sendMSG(request,response) {
  const roomId =  request.params.roomid;
  const participantId =  request.params.participantid;
  const messageBody = request.body.message;
  // const sqlQuery = `INSERT INTO messages( messagebody, roomid, participantid) VALUES($1, $2, $3) RETURNING messageid,time,messagebody,participantid AS table1 SELECT participants.name, messagebody.table1, time.table1 FROM table1 INNER JOIN participants ON participantid.table1=participantid.participants;`

  const sqlQuery1 = `INSERT INTO messages( messagebody, roomid, participantid) VALUES($1, $2, $3) RETURNING messageid,time,messagebody,participantid,name;`

  // const sqlQuery2 = `SELECT messages.messagebody,messages.time, participants.name FROM participants,messages WHERE participants.participantid=$1 AND messages.participantid=$1 ORDER BY messageid DESC LIMIT 1`
  const safeValues = [messageBody,roomId,participantId];
  // const selectQuery = `Select messagebody.messages, time.messages, name.participants FROM messages INNER JOIN participants ON messages.participantid= participants.participantid;`

  console.log(safeValues)
  pool.query(sqlQuery1,safeValues).then((result)=> {
     console.log(result.rows);
     response.status(201).send(result.rows)})
  // .then((result)=> {
  //   console.log(result.rows)
  //  response.status(201).send(result.rows);
  //  })
  }


// function receiveMSG(request,response) {

// }

function saveParticipantInfo(request,response) {
  const name = request.body.name;
  const password = request.body.password;
  const sqlQuery = `INSERT INTO participants(name,email) VALUES($1, $2) RETURNING participantid`
  const safeValues = [name,password]
client.query(sqlQuery,safeValues).then(
   (result) => {
    const id= result.rows[0].participantid;
    console.log(id);
    response.redirect(`/chatrooms/1/${id}`)
  }
)
}








function renderhome(request, response) {
    response.render('../views/index')
}

//About
function renderAbout (request, response) {
  response.render('../views/aboutus');
}

//Sign-In - Admin
function renderSignin(request, response) {
    response.render('../views/admin/sign-in',{massage:''})
}

//---------- Test---------------------------------
app.get('/test', test_fun);

function test_fun(req, res) {

    res.alert('***')

    res.render('../views/test', { key: 'on' });
}


// ***********************************************

function handlerSignin(request, response) {
    const correctPass ='$2b$10$OUI.lZJoD3qNYyot6Nxku.ZSIItP9P5KPtrEf.KcAiDG1XqYvRYKG'
    // const safeValues = request.body.username;
    // const sqlQuery = `SELECT password FROM admins WHERE name=$1`;

    // client.query(sqlQuery,safeValues).then(result => {
    //     correctPass1 = result.rows[0].password;
    //     console.log(correctPass1)
    // })
// const correctPass = 'admin';

    const enteredPassword=request.body.password;

    if (bcrypt.compareSync(enteredPassword, correctPass)) {
        console.log(1)
        response.redirect('/dashboard');
       } else {
        response.render('../views/admin/sign-in',{massage:'incorrect'});
       }
    // bcrypt.hash(myPlaintextPassword, salt).then(encrypted=>{
    //     bcrypt.compare(myPlaintextPassword, encrypted, function(error, result) {
    //         if (result === 'true') {
    //             response.redirect('/dashboard');
    //         }

 }


// Dashboard

function renderDashboard(request, response) {
  const sqlQuery= `SELECT * FROM rooms ORDER BY roomid DESC;`;
  client.query(sqlQuery).then(data=>{
    const list = data.rows;
    console.log(list);
    response.render('../views/admin/dashboard',{ list: list });
  }).catch(error=>{
    errorHandler(error, response);
  });
  
}

// Add a chat room 
function addRoomToDashboard(request, response) {
    const sqlQuery =`INSERT INTO rooms(name,adminid) VALUES($1,1)`;
    const safValues = [request.body.chatroom];
    client.query(sqlQuery,safValues).then(massage=>{
        response.redirect('/dashboard');
    }).catch((error)=>{
        errorHandler(error, response)
    });
 
}
// Edit a chat room
function editRoomInDashboard(request, response) {
  const roomid = request.params.roomid;
  const newName = request.body.name;
  const safeValues = [newName, roomid];
  const sqlQuery = `UPDATE rooms SET name=$1 WHERE roomid=$2;`;
  client.query(sqlQuery, safeValues).then(() => {
    response.redirect('/dashboard');
  }).catch(error => {
    errorHandler(error, response);
  });
}

// Delete a chat room 
function deleteRoomFromDashboard(request, response) {
  const roomid = request.params.roomid;
  console.log(roomid);
  const sqlQuery="DELETE FROM rooms WHERE roomid=$1";
  const safeValues = [roomid];

  client.query(sqlQuery, safeValues).then(() => {
    response.redirect('/dashboard');
  }).catch(error => {
    errorHandler(error, response);
  });
}

// Chat Room 

function renderChatRoom(request, response) {
  const participantid = request.params.participantid;
  const roomid = request.params.roomid;
    response.render('../views/chatroom/chatroom',{participantid:participantid, roomid:roomid})
}

// Participants

// function participantInfoHandler(request, response) {
//     const { name, email } = request.body;
//     const sqlQuery = `INSERT INTO participants(name,email) VALUES($1,$2);`
//     const safeValues = [name, email];
//     // Rooms will be rendered 
//     client.query(sqlQuery, safeValues).then(data => {
//         response.redirect(`/chatrooms`);
//     }).catch((error) => {
//         errorHandler(error, response)
//     })
// }

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

server.listen(
  console.log(`listening on *:${PORT}`));