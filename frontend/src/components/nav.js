import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/authContext';

export default function NavigationBar() {
  const { authInfo } = useContext(AuthContext);
  const { token } = authInfo;

  return (
    <header>
      <ul>
        <li>
          <NavLink to="/events">Events</NavLink>
        </li>
        {token && (
          <li>
            <NavLink to="/bookings">Bookings</NavLink>
          </li>
        )}
        {!token && (
          <li>
            <NavLink to="/auth">Login</NavLink>
          </li>
        )}
      </ul>
    </header>
  );
}
