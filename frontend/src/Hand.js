import React, { Component } from 'react'
import Card from './Card'

class Hand extends Component {

  render() {
    return this.props.cards.map((card, index) =>
      <Card key={index} suit={card.suit.name} rank={card.rank.longName} />
    )
  }

}

export default Hand