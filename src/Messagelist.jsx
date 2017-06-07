import React, {Component} from 'react';
import MessageComponent from './Message.jsx';
import NotificationComponent from './Notification.jsx';
import Message from './Models/Message.js';
import Notification from './Models/Notification.js';


class Messagelist extends Component {
  render() {
      let messagePost = [];
      for (let message of this.props.messages) {
        if(message instanceof Notification) {
          messagePost.push(
            <NotificationComponent key= {message.key} content={message.content} />
          );
        } else if (message instanceof Message) {
          messagePost.push(
            <MessageComponent key={message.key} username={message.user.name} content={message.content} colour={message.user.colour} />
          );
        }
      }
    return (
      <div>
        { messagePost }
      </div>
    );
  }
}

export default Messagelist;