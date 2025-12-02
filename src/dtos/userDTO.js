export class UserDTO {
  constructor(user) {
    this.id = user._id?.toString() || user.id;
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.email = user.email;
    this.age = user.age;
    this.role = user.role;
    this.cart = user.cart?.toString() || user.cart;
  }

  static fromUser(user) {
    if (!user) return null;
    return new UserDTO(user);
  }

  static fromUsers(users) {
    return users.map((user) => UserDTO.fromUser(user));
  }

  toJSON() {
    return {
      id: this.id,
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.email,
      age: this.age,
      role: this.role,
      cart: this.cart,
    };
  }
}

export class CurrentUserDTO {
  constructor(user) {
    this.id = user._id?.toString() || user.id;
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.email = user.email;
    this.role = user.role;
  }

  static fromUser(user) {
    if (!user) return null;
    return new CurrentUserDTO(user);
  }

  toJSON() {
    return {
      id: this.id,
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.email,
      role: this.role,
    };
  }
}

