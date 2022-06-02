import React, { Component } from 'react'

export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { error: false }
    }

    static getDerivedStateFromError(error) {
        return {error: true}
    }

  render() {
      if(this.state.error) {
          return(
              <div>
                  TODO MAL URA
              </div>
          )
      }
    return this.props.children;
  }
}
