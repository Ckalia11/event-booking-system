import { useState, useEffect } from 'react';

export default function GetBookings() {
  const [bookings, setBookings] = useState([]);
  useEffect(() => {
    const uri = 'http://localhost:9000/graphql';
    const query = `{bookings {event {title} user {email}}}`;
    fetch(uri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2NGYxMDY4NmZlMzI1Yjg1N2NhYWViNWYiLCJlbWFpbCI6ImEiLCJpYXQiOjE2OTM5NTU0MDgsImV4cCI6MTY5Mzk1OTAwOH0.aOZ_BFRCl1R2tV9iLzoiC0SjYX58ARzb2FAfYppiEJQ',
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
  }, []);
  return (
    <div>
      <h1>Bookings List</h1>
      <ul>
        {bookings &&
          bookings.map((booking, index) => (
            <li key={index}>
              <h2>{booking.event.title}</h2>
            </li>
          ))}
      </ul>
    </div>
  );
}
