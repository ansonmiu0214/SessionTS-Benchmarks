import express from 'express';
import WebSocket from 'ws';
import http from 'http';

// const Browser = require('zombie');

import { Svr, Session } from './PingPong/Svr';

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const MSGS = Number(process.env.MSGS) || 10;

const logic = Session.Initial({
  PING: (Next, count) => {
    console.time(`pingpong${++count}`);
    if (count === MSGS) {
      return Next.BYE([count], Session.Terminal);
    } else {
      return Next.PONG([count], logic);
    }
  }
});

new Svr(wss, (role, reason) => {
  console.error(`${role} cancelled because of ${reason}`);
}, (sessionID) => logic);

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);

  // new Browser().visit('http://localhost:3000', () => {
  //   console.log('Loaded page');
  // });
});