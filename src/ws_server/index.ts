import WebSocket from 'ws';

// Create a WebSocket server
export const wss = new WebSocket.Server({ port: 3000 });

// Event handler for new connections
wss.on('connection', (ws) => {
  console.log('New client connected');

  // Event handler for receiving messages from clients
  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);

    // Echo the received message back to the client
    ws.send(`You sent: ${message}`);
  });

  // Event handler for connection close
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});


