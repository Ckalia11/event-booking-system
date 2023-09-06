import { useState, useEffect } from 'react';

export default function GetEvents() {
  const [events, setEvents] = useState([]);
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
  return (
    <div>
      <h1>Event List</h1>
      <ul>
        {events &&
          events.map((event, index) => (
            <li key={index}>
              <h2>{event.title}</h2>
            </li>
          ))}
      </ul>
    </div>
  );
}
