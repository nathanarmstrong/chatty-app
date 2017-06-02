import React, {Component} from 'react';
import Messagelist from './Messagelist.jsx';
import ChatBar from './ChatBar.jsx';


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: [{name: "Bob"}],
      messages: [
        {
          id: 1,
          username: "Bob",
          content: "Has anyone seen my marbles?",
        },
        {
          id: 2,
          username: "Anonymous",
          content: "No, I think you lost them. You lost your marbles Bob. You lost them for good."
        }
      ]
    }
  }

  handleChange(content) {
    let user = this.state.currentUser;
    let newUser = user.concat({
      name: content
      })
      this.setState({currentUser: newUser })
      console.log(newUser)
  }

  onNewPost(content) {
    // console.log(content);
    const messages = this.state.messages;
    const newPost = messages.concat({
      id: messages.length + 1,
      username: "Bob",
      content: content
    });
    this.ws.send(JSON.stringify(newPost));
  }



  componentDidMount() {
    this.ws = new WebSocket ('ws://localhost:3001/');
    let me = this;
    this.ws.onmessage = function (evt) {
      if (evt.data) {
        let show = JSON.parse(evt.data);
        me.setState({messages: show})
      }
    }

  }





  render() {
    return (
      <div>
        <nav className="navbar">
          <a href="/" className="navbar-brand">Chatty</a>
        </nav>
        <Messagelist messages={ this.state.messages } />
        <ChatBar handleChange={this.handleChange.bind(this)} onNewPost={ this.onNewPost.bind(this) } currentUser={ this.state.currentUser }   />
      </div>
    );
  }
}




export default App;