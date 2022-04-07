const express = require('express')

const app = express()
const PORT = process.env.PORT || 8003

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static('public'))



io.on('connection', (socket) => {
    console.log(`connect by ${socket.username}`)
    const users = [];
    for (let [id, socket] of io.of("/").sockets) {
        users.push({
            userID: id,
            username: socket.username,
        });
    }
    io.emit("users", users);
    // ...
    
    socket.onAny((event, ...args) => {
        console.log(event, args);
    });

    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
        io.emit('chat message', {name:socket.username,txt:msg});
    });
    socket.on("connect_error", (err) => {
        if (err.message === "invalid username") {
            this.usernameAlreadySelected = false;
        }
    }); 
    
    socket.on("disconnect", () => {
        console.log(`bye`)
    });
});



io.use((socket, next) => {
    
    const username = socket.handshake.auth.username;
    if (!username) {
        return next(new Error("invalid username"));
    }
    socket.username = username;
    console.log(`welcome ${username}`);
    next();
});


const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.get('/', (req, res) => res.render('index.ejs'))

server.listen(PORT, () => console.log(`http://localhost:${PORT}`))