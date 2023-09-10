import React, { useState, useEffect, useRef, useContext } from 'react';
import AuthContext from '../context/authContext';
import NavigationBar from '../components/nav';

export default function AddEvent() {
  const { authInfo } = useContext(AuthContext);
  const { token } = authInfo;

  const titleEl = useRef();
  const descriptionEl = useRef();
  const priceEl = useRef();
  const dateEl = useRef();

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
      <NavigationBar />
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
    </React.Fragment>
  );
}
