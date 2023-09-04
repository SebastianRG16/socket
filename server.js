const http = require('http');
const WebSocket = require('ws');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('WebSocket server');
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Cliente conectado');

  // Manejar mensajes del cliente
  ws.on('message', (message) => {
    console.log(`Mensaje recibido: ${message}`);

    // Enviar un mensaje de vuelta al cliente
    ws.send('Mensaje recibido por el servidor');
  });
});

server.listen(8000, () => {
  console.log('Servidor WebSocket escuchando en el puerto 8000');
});


