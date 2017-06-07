class Message {
  constructor(user, content, key = null) {
    this.key = key;
    this.user = user;
    this.content = content;
  }
}
export default Message;
