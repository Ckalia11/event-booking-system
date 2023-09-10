import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/authContext';

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);

  const { authInfo } = useContext(AuthContext);
  const { token } = authInfo;

  const getBookings = () => {
    const uri = 'http://localhost:9000/graphql';
    const requestBody = {
      query: `query {
      bookings {
        _id
      }
    }`,
    };
    fetch(uri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(requestBody),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setBookings(data.data.bookings);
      })
      .catch((err) => console.log(err));
  };

  useEffect(getBookings, []);

  const bookingsDisplay = bookings?.map((booking) => (
    <li key={booking._id}>
      <h2>{booking?._id}</h2>
    </li>
  ));

  return (
    <React.Fragment>
      <ul>{bookingsDisplay}</ul>;
    </React.Fragment>
  );
}
