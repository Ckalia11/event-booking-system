import { useRef } from 'react';
import { useContext } from 'react';
import AuthContext from '../context/authContext';

export default function AuthPage() {
  const emailEl = useRef();
  const passwordEl = useRef();

  const { login } = useContext(AuthContext);

  const submitHandler = (e) => {
    e.preventDefault();

    const email = emailEl.current.value;
    const password = passwordEl.current.value;

    const uri = 'http://localhost:9000/graphql';
    // const requestBody = {
    //   query: `mutation {
    //     createUser(userInput: {email: "${email}" password: "${password}"})
    //     {
    //       _id
    //     }
    //   }`,
    // };
    const requestBody = {
      query: `query {
      login(email: "${email}" password: "${password}") {
        token
        userID
        expiryHours
      }
    }`,
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
        if (data.data.login.token) {
          login(
            data.data.login.token,
            data.data.login.userID,
            data.data.login.tokenExpiration
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <form onSubmit={submitHandler}>
      <div>
        <label htmlFor="email">Email</label>
        <input type="text" id="email" ref={emailEl}></input>
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
