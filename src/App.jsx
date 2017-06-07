const uuidV1 = require('uuid/v1');
import React, {Component} from 'react';
import Messagelist from './Messagelist.jsx';
import ChatBar from './ChatBar.jsx';
import User from './Models/User.js';
import Message from './Models/Message.js';
import Notification from './Models/Notification.js';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentUser: new User(""),
      messages: [],
      onlineUserCount: 0
    };

    this.addChatMessage = this.addChatMessage.bind(this);
    this.changeUser = this.changeUser.bind(this);
  };

  addChatMessage(event) {
    if (event.key === 'Enter') {
      const newChatMessage = {
        key: uuidV1(),
        user: this.state.currentUser,
        content: event.target.value,
        type: "postMessage"
      }
      this.socket.send(JSON.stringify(newChatMessage));
      event.target.value = "";
    }
  };

  changeUser(event) {
    const timeStamp = Date.now();
    const updatedUser = this.state.currentUser.withNewName(event.target.value);
    this.setState({
      currentUser: updatedUser
    });
    if(this.state.currentUser === ""){
        this.state.currentUser = "No one"
      }
    const newUserName = {
      type: "postNotification",
      user: updatedUser,
      notification: `${this.state.currentUser.name} has changed their name to ${updatedUser.name}.`,
      key: timeStamp
    }
    this.socket.send(JSON.stringify(newUserName));
  }

  componentDidMount() {
    this.socket = new WebSocket('ws://localhost:3001');
    this.socket.onopen = () => {

    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      switch(data.type) {
        case "incomingMessage":
          const incomingMessage = new Message(
            data.user,
            data.content,
            data.uniqueKey
          );
          this.setState({ messages: this.state.messages.concat(incomingMessage) });
        break;
        case "incomingNotification":
          const incomingNotification = new Notification(
            data.user,
            data.notification,
            data.uniqueKey
          );
          this.setState({ messages: this.state.messages.concat(incomingNotification) });
        break;
        case "onlineUsers":
          this.setState({ onlineUserCount: parseInt(data.value) });
          break;
        case "colourAssignment":
          this.setState({ currentUser: this.state.currentUser.withNewColour(data.colour) });
          break;
        default:
        throw new Error(`Unknown event type ${data.type}`);
      }
    }
  };




  render() {
    return (
      <div>
        <nav className="navbar">
         <a href="/" className="navbar-brand">Chatterbox</a>
          <div className="online-users">
            <p>{this.state.onlineUserCount} User(s) Online</p>
          </div>
        </nav>
        <Messagelist messages={this.state.messages} />
        <ChatBar user={this.state.currentUser} addChatMessage={this.addChatMessage} changeUser={this.changeUser} />
      </div>
    )
  }
}


export default App;