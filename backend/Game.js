const WebSocket = require('ws');
const { decks } = require('cards');

class Game {
  constructor(wss) {
    this.wss = wss;
    this.clients = this.wss.clients;
    this.player_count = this.clients.size;
    this.round = 0;
    this.cards_count = 7;

    this.deck = new decks.StandardDeck({ jokers: 0 });
    this.deck.shuffleAll();

    this.info = {
      players: this.player_count,
      round: this.round,
      cards_count: this.cards_count
    }

    this.players = []

    for (var i = 0; i < this.players.length; i++) {
      this.players.push({
        client: this.players[i],
        hand: [],
        points: 0
      })
    }

    // too many players check
    if (52/this.player_count < 7) console.log(`Max players: 7, was: ${this.player_count}`);

    this.updatePlayers()
  }

  startRound() {
    if (!this.deck) return false;
    this.deck.shuffleAll();



    this.sendToAllWithAction(function(send, player){
      const hand = deck.draw(7)
      player.hand = hand;
      send({ type: 'action', name: 'player:hand', data: hand })
    })
    this.updatePlayers()
  }

  nextRound() {
    this.round++;
  }

  getInfo() {
    return this.info;
  }

  updatePlayers() {
    this.sendToAll({ type: 'info', name: 'game:update', data: this.getInfo() })
    console.log("-> updated players");
  }

  stopGame() {
    this.sendToAll({ type: 'info', name: 'game:stopped' })
    console.log("-> game stopped");
  }




  /* Broadcasting utils */

  sendToAll(msg) {
    this.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(msg));
      }
    });
  }

  sendToAllWithAction(action) {
    for (var i = 0; i < this.players.length; i++) {
      const player = this.players[i]
      const client = player.client
      if (client.readyState === WebSocket.OPEN) {
        action((msg) => {
          client.send(JSON.stringify(msg));
        }, player)
      }
    };
  }

  // sendToAllWithAction(action) {
  //   this.clients.forEach(function each(client) {
  //     if (client.readyState === WebSocket.OPEN) {
  //       action((msg) => {
  //         client.send(JSON.stringify(msg));
  //       })
  //     }
  //   });
  // }
}

module.exports = Game;