import React from'react';

class ChatBar extends React.Component {

  render() {
    return (
      <footer className="chatbar">
        <input className="chatbar-username" onBlur={this.props.changeUser} placeholder="Username" defaultValue={this.props.user.name} style={{color: this.props.user.colour}} />
        <input className="chatbar-message" onKeyPress={this.props.addChatMessage} placeholder="Please write a Message" />
      </footer>
    );
  }
}
export default ChatBar;