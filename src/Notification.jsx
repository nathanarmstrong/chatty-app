import React, {Component} from 'react';


class Notification extends Component {
  render() {
    return (
      <div className="message system">
        <span className="message-username">User Name Change</span>
        <span className="message-content">{this.props.content}</span>
      </div>
    );
  }
}

export default Notification;