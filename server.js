// const http = require('http');
// const WebSocket = require('ws');

// const server = http.createServer((req, res) => {
//   res.writeHead(200, { 'Content-Type': 'text/plain' });
//   res.end('WebSocket server');
// });

// const wss = new WebSocket.Server({ server });

// wss.on('connection', (ws) => {
//   console.log('Cliente conectado');

//   // Manejar mensajes del cliente
//   ws.on('message', (message) => {
//     console.log(`Mensaje recibido: ${message}`);

//     // Enviar un mensaje de vuelta al cliente
//     ws.send('Mensaje recibido por el servidor');
//   });
// });

// server.listen(8000, () => {
//   console.log('Servidor WebSocket escuchando en el puerto 8000');
// });
const http = require('http');
const { Pool } = require('pg');
const WebSocket = require('ws');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('WebSocket server');
});

const pgPool = new Pool({
  user: 'sebastian',
  host: 'zaperoco.postgres.database.azure.com',
  database: 'zaperoco',
  password: '1234Garzon',
  port: 5432,
  ssl: {
    rejectUnauthorized: false, // Importante para evitar errores de certificado en Azure
  },
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  // console.log('Cliente conectado');

  // Escuchar notificaciones desde PostgreSQL
  const notificationCallback = (payload) => {
    // console.log(`Notificación recibida en el canal: ${payload.channel}`);
    // Puedes procesar la notificación según tus necesidades
    // Por ejemplo, enviarla a través de WebSocket al cliente
    ws.send(`Notificación: ${payload.payload}`);
  };

  pgPool.connect((err, client, done) => {
    if (err) {
      // console.error('Error al conectarse a la base de datos:', err.message);
      return;
    }
    client.on('notification', notificationCallback);
    const query = 'LISTEN preregistro_registro_event'; // Escucha el canal de notificación
    client.query(query, (err) => {
      if (err) {
        // console.error('Error al iniciar la escucha de cambios:', err.message);
        return;
      }
      // console.log('Escuchando cambios en el canal');
    });
  });

  // Manejar la desconexión del cliente
  ws.on('close', () => {
    // console.log('Cliente desconectado');
  });
});

server.listen(8000, () => {
  // console.log('Servidor WebSocket escuchando en el puerto 8000');
});