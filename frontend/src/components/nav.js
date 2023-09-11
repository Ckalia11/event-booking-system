import './nav.css';
import { useContext } from 'react';
import AuthContext from '../context/authContext';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { NavLink } from 'react-router-dom';

export default function NavigationBar() {
  const { authInfo, logout } = useContext(AuthContext);
  const { token } = authInfo;

  let authButton = !token ? (
    <Button component={NavLink} to="/sign-in" color="inherit">
      Login
    </Button>
  ) : (
    <Button component={NavLink} to="/sign-in" color="inherit" onClick={logout}>
      Logout
    </Button>
  );

  return (
    <AppBar position="static">
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <Typography variant="h6" component="div">
            Eventing
          </Typography>
        </div>
        <div>
          <Button component={NavLink} to="/events" color="inherit">
            Events
          </Button>
          {token && (
            <Button component={NavLink} to="/bookings" color="inherit">
              Bookings
            </Button>
          )}
          {authButton}
        </div>
      </Toolbar>
    </AppBar>
  );
}
