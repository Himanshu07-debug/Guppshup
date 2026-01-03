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
    origin: "https://guppshupp.netlify.app",
    credentials: true
}));


app.use(express.json());

app.use('/api', UserRoutes);
app.use('/message', MessageRoutes);


const PORT = 3001;


Connection().then(() => {
    console.log('connected to database!!');
}).catch((err) => {
    console.log(`Cant Connect to Server 😔😔😔 due to : ${err.message}`);
})

const server = app.listen(PORT, () => {
    console.log(`Server is Listening on Port : ${PORT} 🚀🚀🚀`);
});

app.get("/home", (req, res) => {
    res.send(`<html>Hello</html>`)
})



const io = new Server(server, {
    cors: {
        origin: "https://guppshupp.netlify.app",
        credentials: true
    }
})


global.onlineUsers = new Map();

io.on('connection', (socket) => {

    global.chatSocket = socket;

    io.emit('online-users', Array.from(onlineUsers.keys()));

    socket.on('disconnect', () => {
        // console.log(socket.id);
        const userId = findUserIdBySocketId(socket.id);
        // console.log(userId)
        if (userId) {
            onlineUsers.delete(userId);
            console.log('User disconnected:', userId);
            console.log('Online users:', onlineUsers);
        }
    })

    socket.on('add-user', (userId) => {
        console.log('user-connected!!');
        onlineUsers.set(userId, socket.id);
        console.log(onlineUsers);
    })

    // console.log(onlineUsers);

    socket.on('msg-send', (data) => {
        const sendUserSocket = onlineUsers.get(data.to);

        if (sendUserSocket) {
            socket.to(sendUserSocket).emit('msg-receive', data.message);
        }

    })

    function findUserIdBySocketId(socketId) {
        for (const [userId, id] of onlineUsers.entries()) {
            if (id === socketId) {
                return userId;
            }
        }
        return null;
    }

})

