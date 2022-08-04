How to run Webcall:

    Preliminary:

        * Visual Studio Code is preferred 
        * Open three separate windows in the terminal
    
    Server-side: (terminal 1)

        $ cd server
        $ npm start
        
    Peer-Server: (terminal 2)
        
        $ cd client
        $ peerjs --port 3030       (or any port excluding 5000,3000,3001)

    Client-side: (terminal 3)

        $ cd client
        $ npm start

        - running on same port?
        $ y

---------------------------------

Run-time Instructions:

    *Open a browser and enter the URL: http://localhost:3001/

    Initiator:

        1. Input 'Nickname'
        2. Copy the displayed room ID or create a custom ID in 'ID to Call'
        3. Click 'join'
        4. Send room ID to participants
        5. Wait for Call -> Answer Call

    Participant:

        1. Input 'Nickname'
        2. Input given room ID into 'ID to Call'
        3. Click 'Join'
        3. Wait for Answer -> inject into room
               
---------------------------------

Installed Dependencies:

    server-side:

        $ cd server
        $ npm install express socket.io nodemon uuid

    client-side:
        
        $ cd client
        $ npm install socket.io-client peerjs
        

---------------------------------

Broswer Compatability: 

    *latest versions of all broswers are compatible*

    Chrome: 
        - Version 7.0+
    
    Firefox
        - Version 6.0+

    Safari
        - Verions 6.0+

    Internet Explorer
        - Versions 9.0+  

---------------------------------

Development Stack:
      
      v1.0.0:
         Languages
            - JavaScript
            - HTML5
            - CSS
         API
            - ReactJS
            - Socket.io
            - PeerJS
            
---------------------------------

Version History:

      MPWC v1.0.0 (2022):
         - Multi-peer Webcall functionality
         - Dual Websocket Servers with ReactJS Client Interface
         - Four Participants per room
         - Dark Mode Inspired Theme
        
