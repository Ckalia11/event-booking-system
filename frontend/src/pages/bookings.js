import { useState, useContext } from 'react';
import AuthContext from '../context/authContext';

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const { token } = useContext(AuthContext);

  const uri = 'http://localhost:9000/graphql';
  const query = `{bookings {event {title} user {email}}}`;
  fetch(uri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify({ query: query }),
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      setBookings(data.data.bookings);
    })
    .catch((err) => console.log(err));

  return (
    <div>
      <h1>Bookings List</h1>
      <ul>
        {bookings?.map((booking) => (
          <li key={booking._id}>
            <h2>{booking?.event.title}</h2>
          </li>
        ))}
      </ul>
    </div>
  );
}
