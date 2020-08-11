import React, { Component } from 'react'

class Card extends Component {

  render() {
    return (
      <p>{this.props.rank} of {this.props.suit}</p>
    )
  }
}

export default Card