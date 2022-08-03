const express = require("express")
const http = require("http")
const app = express()
var cors = require("cors")
app.use(cors())
const server = http.createServer(app)
const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:3001",
        methods: ["GET", "POST"],
        credentials: true
    }
})
const uuidV4 = require('uuid').v4
const PORT = 3000
// holds list of users

io.sockets.on("connection", (socket) => {

    // emit my own ID
    socket.emit("me", {userID: socket.id, roomID: uuidV4()})

    // if user disconnects from room, remove from room
    socket.on("disconnect", (data) => {
        socket.leave(data.roomName)
    })

    socket.on("request", (data) => {
        socket.join(data.roomID)
        io.socket.to(data.userID).emit("request accepted")
        io.sockets.to(data.roomID).broadcast.emit('new-user', data.userID)
        console.log(`${data.name} has joined room ${data.roomID}`)
    })

})


server.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})