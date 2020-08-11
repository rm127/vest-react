import React, { Component } from 'react'
import Hand from './Hand'

const URL = 'ws://localhost:8080'

class Game extends Component {
  state = {
    username: 'Temp',
    hand: [],
    connected_to_backend: false
  }

  ws = null;

  componentDidMount() {

    this.ws = new WebSocket(URL)

    this.ws.onopen = () => {
      console.log('connected to backend')
      this.setState({
        connected_to_backend: true
      })
    }

    this.ws.onmessage = evt => {
      const msg = JSON.parse(evt.data)
      console.log(msg);
      // if type is action
      if (msg.type === 'info') {
        switch (msg.name) {

          case 'game:update':
            this.setState({
              game_info: msg.data
            })
            break;

          default:
            console.log("-> unrecognized action");
        }
      }

      if (msg.type === 'action') {
        console.log(msg.name);
        switch (msg.name) {

          case 'player:hand':
            console.log(msg.data);
            this.setState({
              hand: msg.data
            })
            break;

          default:
            console.log("-> unrecognized action");
        }
      }
    }

    this.ws.onclose = () => {
      console.log('disconnected')
      this.setState({
        connected_to_backend: false
      })
      this.ws.close()
      // automatically try to reconnect on connection loss
      // this.setState({
      //   ws: new WebSocket(URL),
      // })
    }
  }

  sendMsg = (e) => {
    const msg = e.target.getAttribute('data');
    this.ws.send(msg)
  }

  render() {
    return (
      <div>
        <p>Connected to backend: {String(this.state.connected_to_backend)}</p>
        <p>Game info: {JSON.stringify(this.state.game_info)}</p>
        <button onClick={this.sendMsg} data='{ "type": "action", "name": "game:new" }'>Create new game</button>
        <button onClick={this.sendMsg} data='{ "type": "action", "name": "game:startRound" }'>Start game</button>
        <button onClick={this.sendMsg} data='{ "type": "action", "name": "game:nextRound" }'>Next round</button>
        <Hand cards={this.state.hand} />
      </div>
    )
  }
}

export default Game