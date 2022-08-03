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
    socket.emit("room", {roomID: uuidV4()})
    // if user disconnects from room, remove from room
    socket.on("disconnect", (data) => {
        socket.leave(data.roomID)
    })
    socket.on("disconnecting", (data) => {
        socket.to(data.roomID).emit("user-disconnected", {userID: data.userID})
    })

    socket.on("join", (data) => {
        socket.join(data.roomID)
        socket.to(data.roomID).broadcast.emit('new-user', data.userID)
        socket.to(data.userID).emit("responce", data.roomID)
        console.log(`${data.name} has joined room ${data.roomID}`)
    })

})


server.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})
