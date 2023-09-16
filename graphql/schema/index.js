const { buildSchema } = require('graphql');

module.exports = buildSchema(`
type Event {
  _id: ID!
  title: String!
  description: String!
  price: Float!
  date: String!
  creator: User!
}

type Booking {
  _id: ID!
  event: Event!
  user: User!
  createdAt: String!
  updatedAt: String!
}

type User {
  _id: ID!,
  email: String!,
  password: String
  createdEvents: [Event]!
}

type AuthResponse {
  userID: ID!
  token: String!
  expiryHours: Int!
}

input EventInput {
  title: String!
  description: String!
  price: Float!
  date: String!
}

input UserInput {
  email: String!,
  password: String!,
}

type RootQuery {
    events: [Event!]!
    event(eventID: ID!): Event!
    user(userID: ID!): User!
    bookings: [Booking!]!
    login(email: String!, password: String!): AuthResponse!
}

type RootMutation {
    createEvent(eventInput: EventInput): Event
    createUser(userInput: UserInput): User
    bookEvent(eventID: ID!): Booking!
    cancelBooking(bookingID: ID!): Event!
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);
