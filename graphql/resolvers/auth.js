const bcrypt = require('bcrypt');
const User = require('../../models/user');
const { transformUser } = require('./helpers');

const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = {
  user: (args) => {
    return User.findById(args.userID)
      .then((user) => {
        if (!user) {
          throw new Error('User not found');
        }
        return transformUser(user);
      })
      .catch((err) => {
        throw err;
      });
  },
  login: ({ email, password }) => {
    let user;
    return User.findOne({ email: email })
      .then((result) => {
        if (!result) {
          throw new Error('User not found');
        }
        user = result;
        return bcrypt.compare(password, user.password);
      })
      .then((isEqual) => {
        if (!isEqual) {
          throw new Error('login information incorrect');
        }
        const token = jwt.sign(
          { userID: user._id, email: user.email },
          process.env.JWT_KEY,
          { expiresIn: '1hr' }
        );
        return { userID: user._id, token: token, expiryHours: 1 };
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
