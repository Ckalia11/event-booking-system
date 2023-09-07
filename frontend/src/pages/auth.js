import { useRef } from 'react';

export default function Auth() {
  const emailEl = useRef();
  const passwordEl = useRef();

  const submitHandler = (e) => {
    e.preventDefault();

    const email = emailEl.current.value;
    const password = passwordEl.current.value;

    const uri = 'http://localhost:9000/graphql';
    const requestBody = {
      query: `mutation {createUser(userInput: {email: "${email}" password: "${password}"}){_id}}`,
    };
    fetch(uri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
    <form onSubmit={submitHandler}>
      <div>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" ref={emailEl}></input>
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input type="password" id="password" ref={passwordEl}></input>
      </div>
      <div>
        <button type="submit">Submit</button>
      </div>
    </form>
  );
}
