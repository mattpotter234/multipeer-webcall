import './App.css'
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import Typography from '@mui/material/Typography'
import React, * as react from "react"
import io from "socket.io-client"
import Peer from "peerjs"
import "./App.css"

const socket = io.connect("http://127.0.0.1:3000",{withCredentials: true, reconnect:true})

const myPeer = new Peer(undefined, {
  host: '/',
  port: '3030',
  config: { 'iceServers': [
    { 'url': 'stun:stun.l.google.com:19302' }  
  ] }
})

function App() {

const [me, setMe] = react.useState("")
const [name, setName] = react.useState("")
const [roomID, setRoomID] = react.useState("")
const [streamOptions, setStreamOptions] = react.useState()

const [idToCall, setIdToCall] = react.useState("")
const [inRoom, setInRoom] = react.useState(false)


const [u1, setU1] = react.useState('null')
const [u2, setU2] = react.useState('null')
const [u3, setU3] = react.useState('null')


const userVideo = react.useRef()
const userV1 = react.useRef()
const userV2 = react.useRef()
const userV3 = react.useRef()

var peerCount = 0;


const streams = react.useRef([])

  react.useEffect( () => {

    const constraints = {
      audio: true,
      video: true
    }
    navigator.mediaDevices.getUserMedia(constraints)
    .then((stream) => {
      //setStreamOptions(stream)
      addVideo(userVideo, stream)
      
     myPeer.on('call', call => {
       call.answer(stream)
       //const video = react.useRef()
       call.on('stream', userstream => {
        if(peerCount === 0){
          addVideo(userV1, userstream)
        } else if(peerCount === 1){
          addVideo(userV2, userstream)
        } else if (peerCount == 2){
          addVideo(userV3, userstream)
        }
       })
     })
    
     socket.on("new-user", (userID) => {
       if(userID !== me) {
        connectPeer(userID, stream)
        if (peerCount === 0){
          setU1(userID)
          peerCount = peerCount+1
        } else if (peerCount === 1){
          setU2(userID)
          peerCount = peerCount+1
        } else if (peerCount === 2){
          setU3(userID)
          peerCount = peerCount+1
        }
      }
     })
    })

    myPeer.on('open', id => {
      setMe(id)
    })
    
    // set my own socketID
    socket.on("room", (data) => {
      setRoomID(data.roomID)
    })

    socket.on("responce", (roomID) => {
      setRoomID(roomID)
    })

    socket.on('user-disconnected', (data) => {
      shuffle(data.userID)
    })

    function addVideo(video, stream){
      video.current.srcObject = stream
    }

    function connectPeer(userID, stream){
      const call = myPeer.call(userID, stream)
      //const video = react.useRef()
      call.on('stream', (userstream) => {
        if (peerCount === 0){
          addVideo(userV1, userstream)
        } else if (peerCount === 1){
          addVideo(userV2, userstream)
        }else if (peerCount === 2){
          addVideo(userV3, userstream)
        }

      })
      call.on('close', () =>{
          
      })
    }

   function shuffle(userID){
    if(userID === u1 && peerCount === 0){
      setU1('null')
      userV1.destroy()
     }
    else if(userID === u1 && peerCount === 1){
      setU1('null')
      userV1.destroy()
    }
    else if(userID === u1 && peerCount === 2){
      userV1 = userV2
      setU1(u2)
      userV2.destroy()
    }
    else if (userID === u1 && peerCount === 3) {
      userV1 = userV2
      setU1(u2)
      userV2 = userV3
      setU2(u3)
      userV3.destroy()
      setU3('null')
      peerCount = peerCount-1
    } else if (userID === u2 && peerCount == 3) {
      userV2 = userV3
      setU2(u3)
      userV3.current.destroy()
      setU3('null')
      peerCount = peerCount-1
    } else if (userID === u2 && peerCount == 2) {
      userV2.current.destroy()
      setU2('null')
      userV3.current.destroy()
      setU3('null')
      peerCount = peerCount-1
    } 
    else if (userID === u3) {
      userV3.current.destroy()
      setU3('')
      peerCount = peerCount-1
    }
  }
  
   });

   const leaveCall = () => {
        setInRoom(false)
        socket.emit('disconnecting', {userID: me, roomID: roomID})
   }
   // outgoing (participant)
    const callPeer = (room) => {
        socket.emit("join", {
            roomID: room,
            userID: me,
            name: name
        })
        console.log(`request sent`)
        setInRoom(true)
    }

    const muteCall = () => {
      streamOptions.getAudioTracks()[0].enabled = !(streamOptions.getAudioTracks()[0].enabled)
            if(streamOptions.getAudioTracks()[0].enabled === false){
                console.log(" - Audio Muted.")
            } else {
                console.log(" - Audio Unmuted.")
            }
    }
    const hideCamera = () => {
      streamOptions.getVideoTracks()[0].enabled = !(streamOptions.getVideoTracks()[0].enabled)
      if(streamOptions.getVideoTracks()[0].enabled === false){
          console.log(" - Camera Hidden.")
      } else {
          console.log(" - Camera Active.")
      }
   }

  return ( 
    <div className="App">
      <div className = "buttons">

        <Typography>Room ID: {roomID}</Typography>
        <TextField id="filled-basic" label="nickname" variant="filled" value={name} onChange={(e) => setName(e.target.value)} style={{marginBottom: "20px", marginRight:"20px"}} />
        <TextField id="filled-basic" label="Room ID to Call" variant="filled" value={idToCall} onChange={(e) => setIdToCall(e.target.value)} style={{marginBottom: "20px", marginRight:"20px"}}/>
        {!inRoom ? (
        <Button variant="contained" onClick={() => callPeer(idToCall)}>
          Call
        </Button>
        ):(
        <Button variant="contained" onClick={() => leaveCall()}>
          leave
        </Button>
        )}
        <Button variant="contained" onClick={muteCall}>
          Mute
        </Button>
        <Button variant="contained" onClick={hideCamera}>
          Hide
        </Button>
      </div> 
      {!inRoom ? (
        <video className="videoStream" playsInline muted autoPlay ref={userVideo} />
      ):(
        <div>
        <video className="videoStream" playsInline muted autoPlay ref={userVideo} />
        <video className="videoStream" playsInline muted autoPlay ref={userV1} />
        <video className="videoStream" playsInline muted autoPlay ref={userV2} />
        <video className="videoStream" playsInline muted autoPlay ref={userV3} />
        </div>
      )}
    </div> 
  )// return
} // app

//<video className="videoStream" playsInline muted autoPlay ref={userVideo} />
export default App
