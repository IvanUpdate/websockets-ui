import { httpServer } from "./src/http_server/index";
import WebSocket from 'ws';

const HTTP_PORT = 8181;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);


// Create a WebSocket server
const wss = new WebSocket.Server({ port: 3000 });

// Event handler for new connections
wss.on('connection', (ws) => {
  console.log('New client connected');

  // Event handler for receiving messages from clients
  ws.on('message', (message: string) => {
    console.log(`Received message: ${message}`);

    const {data, id} = JSON.parse(message)
    console.log(data);

    // Echo the received message back to the client

    const data_1 = JSON.stringify({
        name: data.name,
        index: id,
        error: false,
        errorText: "",
        
        
    });

    const dev = {
        type: "reg",
        data: data_1,
            
        id: 0,
    }
    const dev_2 = JSON.stringify(dev);
    ws.send(dev_2);
    console.log(JSON.parse(dev_2));
  });

  // Event handler for connection close
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});