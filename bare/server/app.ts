import express from 'express';
import WebSocket from 'ws';
import http from 'http';

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const MSGS = Number(process.env.MSGS) || 10;

wss.on('connection', (socket) => {
  console.time('benchmark');

  socket.onclose = (event: WebSocket.CloseEvent) => {
    console.timeEnd('benchmark');
  };

  socket.onmessage = ({ data }) => {
    const { label, payload } = JSON.parse(data.toString());
    if (label === 'PING') {
      let count: number = payload[0] + 1;
      console.time(`pingpong${count}`);
      if (count === MSGS) {
        socket.send(JSON.stringify({
          label: 'BYE',
          payload: [count],
        }));
      } else {
        socket.send(JSON.stringify({
          label: 'PONG',
          payload: [count],
        }));
      }
      console.timeLog('benchmark', count);
      console.timeEnd(`pingpong${count}`);
    } else {
      throw new Error(`Unrecognised label: ${label}`)
    }
  }
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});