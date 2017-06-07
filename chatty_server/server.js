// server.js
const express = require('express');
const SocketServer = require('ws').Server;
const uuidV1 = require('uuid/V1');
const WebSocket = require('ws');

// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
  // Make the express server serve static assets (html, javascript, css) from the /public folder
    .use(express.static('public'))
    .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

  // Create the WebSockets server
  const wss = new SocketServer({ server });

  // Set up a callback that will run when a client connects to the server
  // When a client connects they are assigned a socket, represented by
  // the ws parameter in the callback.
  const colourList = [
    'skyblue',
    'magenta',
    'cyan',
    'green'
  ];

  let nextSocketId = 0;

  wss.broadcast = function broadcast(data) {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  };

  wss.on('connection', (client) => {
    console.log('Client connected');



    const socketId = nextSocketId;
    nextSocketId += 1;
    let userLoggedIn = {
      type: "onlineUsers",
      value: nextSocketId
    }
    wss.broadcast(JSON.stringify(userLoggedIn));
    const colourPayload = {type: 'colourAssignment', colour: colourList[nextSocketId % 4] }
    client.send(JSON.stringify(colourPayload));

    client.on('message', (data) => {
    inMessage = JSON.parse(data);
    switch(inMessage.type) {
      case "postMessage":
        inMessage = {
          uniqueKey: uuidV1(),
          user: inMessage.user,
          content: inMessage.content,
          type: "incomingMessage"
        };
      break;
      case "postNotification":
        inMessage = {
          uniqueKey: uuidV1(),
          user: inMessage.user,
          notification: inMessage.notification,
          type: "incomingNotification"
        };
      break;
      default:
      throw new Error(`Unknown event type ${inMessage.type}`);
    };
      wss.broadcast(JSON.stringify(inMessage));
  });

    // Set up a callback for when a client closes the socket. This usually means they closed their browser.
    client.on('close', () => {
    nextSocketId -= 1;
    let userLoggedOut = {
      type: "onlineUsers",
      value: nextSocketId
    }
    wss.broadcast(JSON.stringify(userLoggedOut));
    console.log('Client has disconnected');
  });

});