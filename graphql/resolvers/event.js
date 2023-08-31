const Event = require('../../models/event');
const User = require('../../models/user');

const { transformEvent } = require('./helpers');

module.exports = {
  events: () => {
    return Event.find()
      .then((events) => {
        return events.map(transformEvent);
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
        createdEvent = transformEvent(result);
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
};
