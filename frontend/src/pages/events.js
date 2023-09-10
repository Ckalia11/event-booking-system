import React, { useState, useEffect, useRef, useContext } from 'react';
import AuthContext from '../context/authContext';

export default function EventsPage() {
  const [events, setEvents] = useState([]);

  const { authInfo } = useContext(AuthContext);
  const { token } = authInfo;

  const titleEl = useRef();
  const descriptionEl = useRef();
  const priceEl = useRef();
  const dateEl = useRef();

  useEffect(() => {
    const uri = 'http://localhost:9000/graphql';
    const query = `{events {title}}`;
    fetch(uri, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: query }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setEvents(data.data.events);
      })
      .catch((err) => console.log(err));
  }, []);

  const eventsDisplay = events?.map((event) => (
    <li key={event._id}>
      <h2>{event?.title}</h2>
    </li>
  ));

  const submitHandler = (e) => {
    e.preventDefault();

    const title = titleEl.current.value;
    const description = descriptionEl.current.value;
    const price = priceEl.current.value;
    const date = dateEl.current.value;

    const uri = 'http://localhost:9000/graphql';
    const requestBody = {
      query: `mutation {
      createEvent(eventInput: {title: "${title}" description: "${description}" price: ${price} date: "${date}"}) {
        title
        description
        price
        date
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
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <React.Fragment>
      <form method="POST" onSubmit={submitHandler}>
        <div>
          <label htmlFor="title">Title</label>
          <input type="text" id="title" ref={titleEl}></input>
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <input type="text" id="description" ref={descriptionEl}></input>
        </div>
        <div>
          <label htmlFor="price">Price</label>
          <input type="number" id="price" ref={priceEl}></input>
        </div>
        <div>
          <label htmlFor="date">Date</label>
          <input type="date" id="date" ref={dateEl}></input>
        </div>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
      <ul>{eventsDisplay}</ul>;
    </React.Fragment>
  );
}
