const Booking = require('../../models/booking');
const Event = require('../../models/event');

const { transformBooking, transformEvent } = require('./helpers');

module.exports = {
  bookings: () => {
    return Booking.find()
      .then((bookings) => {
        return bookings.map(transformBooking);
      })
      .catch((err) => {
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
        return transformBooking(booking);
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
        const event = transformEvent(booking.event);
        return event;
      })
      .catch((err) => {
        throw err;
      });
  },
};
