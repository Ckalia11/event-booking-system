const { transformDate } = require('../../helpers/date');
const Event = require('../../models/event');
const User = require('../../models/user');

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
      return events.map(transformEvent);
    })
    .catch((err) => {
      throw err;
    });
};

const singleEvent = (eventID) => {
  return Event.findById(eventID)
    .then((event) => {
      return transformEvent(event);
    })
    .catch((err) => {
      throw err;
    });
};

const transformEvent = (event) => {
  return {
    ...event._doc,
    date: event.date.toISOString(),
    creator: user.bind(this, event.creator),
  };
};

const transformBooking = (booking) => {
  return {
    ...booking._doc,
    event: singleEvent.bind(this, booking.event),
    user: user.bind(this, booking.user),
    createdAt: transformDate(booking.createdAt),
    updatedAt: transformDate(booking.updatedAt),
  };
};

const transformUser = (user) => {
  return {
    ...user._doc,
    password: null,
    createdEvents: events.bind(this, user.createdEvents),
  };
};

module.exports = {
  transformEvent,
  transformBooking,
  transformUser,
};
