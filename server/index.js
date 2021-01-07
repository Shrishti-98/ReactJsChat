const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');

const router = require('./router');

const app = express(); 
const server = http.createServer(app); // creating server 
const io = socketio(server);  //instance of socketio

app.use(cors());
app.use(router);

io.on('connect', (socket) => { //callback socket will be connected as a client side socket
  socket.on('join', ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room }); //passing parameters to addUser

    if(error) return callback(error); // dynamic error handling from addUser
//if no error then...
    socket.join(user.room);//joins user in a room

//message by admin when user joins a room(from server to client)
    socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.`});
    
// socket.broadcast will broadcast the message to every user except that particular user that joined
    socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });

    io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

    callback();
  });

// this means we are expecting some event on the backend.
  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit('message', { user: user.name, text: message });

    callback();
  });

  // when user will leave
  socket.on('disconnect', (/* */) => { //we don not require any parameters in here bcz user has just left.
    const user = removeUser(socket.id);

    if(user) {
      io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
    }
  })
});

server.listen(process.env.PORT || 5000, () => console.log(`Server has started.`));

