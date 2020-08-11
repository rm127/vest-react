const WebSocket = require('ws');
const Game = require('./Game.js');

const wss = new WebSocket.Server({ port: 8080 });

var gameInstance = null;




function heartbeat() {
  this.isAlive = true;
}



wss.on('connection', function connection(ws) {

  console.log("--> connection");
  ws.isAlive = true;
  ws.on('pong', heartbeat);

  // resend game info on reconnection
  // if (gameInstance) ws.send(gameInstance.getInfo());

  ws.on('message', function incoming(msg) {

    // parse from string to object
    msg = JSON.parse(msg);

    console.log("--> msg: ", msg);

    if (msg.type == 'action') {
      switch (msg.name) {


        case 'game:new':
          console.log("-> creating new game");
          gameInstance = new Game(wss)
          break;

        case 'game:startRound':
          gameInstance.startRound()
          break;

        case 'game:nextRound':
          gameInstance.nextRound()
          break;

        default:
          console.log("-> unrecognized action");

      }
    }

  });
});


// ping pong check

let players = 0;
const interval = setInterval(function ping() {
  new_players = wss.clients.size;
  if (players > new_players) gameInstance.stopGame();

  wss.clients.forEach(function each(ws) {
    if (ws.isAlive === false) {
      return ws.close();
    }

    ws.isAlive = false;
    ws.ping(() => {});
  });
}, 3000);


wss.on('close', function close() {
  clearInterval(interval);
});


/* ====== UTILS ====== */

function broadcast(msg) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(msg));
    }
  });
}

function broadcastWithAction(action) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      action((msg) => {
        client.send(JSON.stringify(msg));
      })
    }
  });
}

/* ====== END UTILS ====== */