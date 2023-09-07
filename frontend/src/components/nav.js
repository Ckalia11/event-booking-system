import { NavLink } from 'react-router-dom';

export default function NavigationBar() {
  return (
    <header>
      <ul>
        <li>
          <NavLink to="/events">Events</NavLink>
        </li>
        <li>
          <NavLink to="bookings">Bookings</NavLink>
        </li>
        <li>
          <NavLink to="/auth">Auth</NavLink>
        </li>
      </ul>
    </header>
  );
}
