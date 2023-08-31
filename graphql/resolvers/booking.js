const Booking = require('../../models/booking');
const Event = require('../../models/event');

const { transformBooking, transformEvent } = require('./helpers');

module.exports = {
  bookings: (_, req) => {
    if (!req.isAuth) {
      throw new Error('unauthenticated');
    }
    return Booking.find()
      .then((bookings) => {
        return bookings.map(transformBooking);
      })
      .catch((err) => {
        throw err;
      });
  },
  bookEvent: (args, req) => {
    if (!req.isAuth) {
      throw new Error('unauthenticated');
    }
    return Event.findById(args.eventID)
      .then((event) => {
        if (!event) {
          throw new Error('Event not found');
        }
        const booking = new Booking({
          user: req.userID,
          event: event,
        });
        return booking.save();
      })
      .then((booking) => {
        return transformBooking(booking);
      })
      .catch((err) => {
        throw err;
      });
  },
  cancelBooking: (args, req) => {
    if (!req.isAuth) {
      throw new Error('unauthenticated');
    }
    return Booking.findByIdAndDelete(args.bookingID)
      .populate('event')
      .then((booking) => {
        if (!booking) {
          throw new Error('no booking found');
        }
        const event = transformEvent(booking.event);
        return event;
      })
      .catch((err) => {
        throw err;
      });
  },
};
