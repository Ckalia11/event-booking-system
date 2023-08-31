const bcrypt = require('bcrypt');
const User = require('../../models/user');
const { transformUser } = require('./helpers');

module.exports = {
  user: (args) => {
    return User.findById(args.userID)
      .then((user) => {
        if (!user) {
          throw new Error('user not found');
        }
        return transformUser(user);
      })
      .catch((err) => {
        throw err;
      });
  },
  createUser: (args) => {
    return User.findOne({ email: args.userInput.email })
      .then((res) => {
        if (res) {
          throw new Error('User already exists');
        }
        const saltRounds = 10;
        return bcrypt.genSalt(saltRounds);
      })
      .then((salt) => {
        return bcrypt.hash(args.userInput.password, salt);
      })
      .then((hash) => {
        const user = new User({
          email: args.userInput.email,
          password: hash,
        });
        return user.save();
      })
      .then((result) => {
        return transformUser(result);
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  },
};
