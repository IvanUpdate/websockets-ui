import { httpServer as server } from './src/http_server/index';
import { Server as WebSocketServer } from 'ws';
import RequestHandler from './src/services/handler';
import { db } from './src/data/database';

const wss = new WebSocketServer({ server });

const HTTP_PORT = 3000;

wss.on('connection', (socket) => {
  const requestHandler = new RequestHandler(socket);

  socket.on('message', (message) => {
    try {
      console.log(message);
      const request = JSON.parse(message.toString());
      requestHandler.handleRequest(request);
    } catch (error) {
      console.error('Error parsing request:', error);
    }
  });

  socket.on('close', () => {
    // Handle socket close event if needed
  });
});

server.listen(HTTP_PORT, () => {
  console.log('WebSocket server is running on port 3000');
});
