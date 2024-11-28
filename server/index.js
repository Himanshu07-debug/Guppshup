import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from 'socket.io';

import Connection from './config/database.js';
import UserRoutes from './routes/UserRoutes.js';
import MessageRoutes from './routes/MessageRoutes.js';


const app = express();
dotenv.config();

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));


app.use(express.json());

app.use('/api', UserRoutes);
app.use('/message', MessageRoutes);


const PORT = 3001;

// Database connection :
Connection().then(() => {
    console.log('connected to database!!');
})
.catch((err) => {
    console.log(`Cant Connect to Server 😔😔😔 due to : ${err.message}`);
})


// server listening code
const server = app.listen(PORT, () => {
    console.log(`Server is Listening on Port : ${PORT} 🚀🚀🚀`);
});



app.get("/home", (req, res) => {
    res.send(`<html>Hello</html>`)
})


// Setting up socket.io server

// also see the import statement of server from socket.io .. yeah npm package hai "socket.io"

// jaise localhost backend ka ek server banaye waise hi socket ka bhi ek server banana pdta hai

// 1. creates a new Socket.IO server instance attached to your existing Express server.
// 2. cors added to provide access to frontend request calls

const io = new Server(server, {
    cors: {
        origin: "https://localhost:3000",
        credentials: true
    }
})

// global variable
// --> onlineUsers is a global Map used to keep track of users currently online.
global.onlineUsers = new Map();


// WHOLE INFORMATION NOW IN markdown file --> server.md

// This listens for new connections. When a user connects to the server, this callback function is executed.
io.on('connection', (socket) => {

    global.chatSocket = socket;

    // Broadcasting online users to all the connected clients
    io.emit('online-users', Array.from(onlineUsers.keys()));

    // Handling User Disconnection:
    socket.on('disconnect', () => {

        // console.log(socket.id);

        const userId = findUserIdBySocketId(socket.id);

        // console.log(userId)

        if (userId) {
            onlineUsers.delete(userId);
            // console.log('User disconnected:', userId);
            // console.log('Online users:', onlineUsers);
        }

    })

    // Adding a User:
    socket.on('add-user', (userId) => {

        // console.log('user-connected!!');
        onlineUsers.set(userId, socket.id);
        // console.log(onlineUsers);

    })

    // console.log(onlineUsers);

    // Handling Message Sending:
    socket.on('msg-send', (data) => {
        const sendUserSocket = onlineUsers.get(data.to);

        if (sendUserSocket) {
            socket.to(sendUserSocket).emit('msg-receive', data.message);
        }

    })

    // Helper Function: findUserIdBySocketId
    function findUserIdBySocketId(socketId) {
        for (const [userId, id] of onlineUsers.entries()) {
            if (id === socketId) {
                return userId;
            }
        }
        return null;
    }

})

