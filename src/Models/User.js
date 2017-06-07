class User {
  constructor(name, colour = null) {
    this.name = name;
    this.colour = colour;
  }
  withNewName(name) {
    return new User(name, this.colour);
  }
  withNewColour(colour) {
    return new User(this.name, colour);
  }
}

export default User;
