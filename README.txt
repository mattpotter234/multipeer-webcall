Broswer Compatability

    Chrome: 
        - Version 7.0+
    
    Firefox
        - Version 6.0+

    Safari
        - Verions 6.0+

    Internet Explorer
        - Versions 9.0+  

---------------------------------

Installed Dependencies

    server-side:

        $ npm install express socket.io nodemon uuid

    client-side:

        $ npm install simple-peer socket.io-client @mui/core @mui/icons

        $ npm install @emotion/react @emotion/style

---------------------------------

How to run Webcall

    Preliminary:

        * VS Code is prefered 
        * Open a split terminal

            1. Terminal > New Terminal
            2. Terminal > Split Terminal

    Server-side:

        $ cd server
        $ npm start

    Client-side:

        $ cd client
        $ npm start

        - running on same port?
        $ y

---------------------------------

Run-time Instructions

    Initiator:

        1. Input name into 'Username'
        2. Copy ID 
        3. Send to Participant
        4. Wait for Call -> Answer Call

    Participant:

        1. Input Username
        2. Paste friend's ID into 'User to Call'
        3. Wait for Answer