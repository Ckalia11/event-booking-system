const bcrypt = require('bcrypt');

const Event = require('../../models/event');
const User = require('../../models/user');

const user = (userID) => {
  return User.findById(userID)
    .then((user) => {
      return {
        ...user._doc,
        createdEvents: events.bind(this, user._doc.createdEvents),
      };
    })
    .catch((err) => {
      throw err;
    });
};

const events = (eventsIDs) => {
  return Event.find({ _id: { $in: eventsIDs } })
    .then((events) => {
      return events.map((event) => {
        return {
          ...event._doc,
          date: new Date(event._doc.date).toISOString(),
          creator: user.bind(this, event.creator),
        };
      });
    })
    .catch((err) => {
      throw err;
    });
};

module.exports = {
  events: () => {
    return Event.find()
      .then((events) => {
        return events.map((event) => {
          return {
            ...event._doc,
            date: new Date(event._doc.date).toISOString(),
            creator: user.bind(this, event._doc.creator),
          };
        });
      })
      .catch((err) => {
        throw err;
      });
  },
  createEvent: (args) => {
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: '64ebf62af06abf5d5483eb41',
    });
    let createdEvent;
    return event
      .save()
      .then((result) => {
        createdEvent = {
          ...result._doc,
          date: new Date(event._doc.date).toISOString(),
          creator: user.bind(this, result._doc.creator),
        };
        return User.findById('64ebf62af06abf5d5483eb41');
      })
      .then((user) => {
        if (!user) {
          throw new Error('user not found');
        }
        user.createdEvents.push(event);
        return user.save();
      })
      .then((_) => {
        return createdEvent;
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
        return {
          ...result._doc,
          password: null,
        };
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  },
};
