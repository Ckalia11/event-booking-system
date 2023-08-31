const bookingResolver = require('./booking');
const eventResolver = require('./event');
const userResolver = require('./auth');

module.exports = {
  ...eventResolver,
  ...userResolver,
  ...bookingResolver,
};
