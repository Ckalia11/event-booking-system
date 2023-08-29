const bcrypt = require('bcrypt');

const Event = require('../../models/event');
const User = require('../../models/user');
const Booking = require('../../models/booking');
const event = require('../../models/event');

const user = (userID) => {
  return User.findById(userID)
    .then((user) => {
      return {
        ...user._doc,
        password: null,
        createdEvents: events.bind(this, user.createdEvents),
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
          date: new Date(event.date).toISOString(),
          creator: user.bind(this, event.creator),
        };
      });
    })
    .catch((err) => {
      throw err;
    });
};

const singleEvent = (eventID) => {
  return Event.findById(eventID)
    .then((event) => {
      return {
        ...event._doc,
        date: new Date(event.date).toISOString(),
        creator: user.bind(this, event.creator),
      };
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
            date: new Date(event.date).toISOString(),
            creator: user.bind(this, event.creator),
          };
        });
      })
      .catch((err) => {
        throw err;
      });
  },
  user: (args) => {
    return User.findById(args.userID)
      .then((user) => {
        if (!user) {
          throw new Error('user not found');
        }
        return {
          ...user._doc,
          password: null,
          createdEvents: events.bind(this, user.createdEvents),
        };
      })
      .catch((err) => {
        throw err;
      });
  },
  bookings: () => {
    return Booking.find()
      .then((bookings) => {
        return bookings.map((booking) => {
          return {
            ...booking._doc,
            event: singleEvent.bind(this, booking.event),
            user: user.bind(this, booking.user),
            createdAt: new Date(booking.createdAt).toISOString(),
            updatedAt: new Date(booking.updatedAt).toISOString(),
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
      creator: '64ed62397d304e11b87d68db',
    });
    let createdEvent;
    return event
      .save()
      .then((result) => {
        createdEvent = {
          ...result._doc,
          date: new Date(event.date).toISOString(),
          creator: user.bind(this, result.creator),
        };
        return User.findById('64ed62397d304e11b87d68db');
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
  bookEvent: (args) => {
    return Event.findById(args.eventID)
      .then((event) => {
        if (!event) {
          throw new Error('Event not found');
        }
        const booking = new Booking({
          user: '64ed62397d304e11b87d68db',
          event: event,
        });
        return booking.save();
      })
      .then((booking) => {
        return {
          ...booking._doc,
          user: user.bind(this, booking.user),
          event: singleEvent.bind(this, booking.event),
          createdAt: new Date(booking.createdAt).toISOString(),
          updatedAt: new Date(booking.updatedAt).toISOString(),
        };
      })
      .catch((err) => {
        throw err;
      });
  },
  cancelBooking: (args) => {
    return Booking.findByIdAndDelete(args.bookingID)
      .populate('event')
      .then((booking) => {
        if (!booking) {
          throw new Error('no booking found');
        }
        const event = {
          ...booking.event._doc,
          creator: user.bind(this, booking.event.creator),
        };
        return event;
      })
      .catch((err) => {
        throw err;
      });
  },
};
