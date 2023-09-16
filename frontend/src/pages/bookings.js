import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import NavigationBar from '../components/nav';
import Orders from '../components/table';
import { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/authContext';

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Bookings() {
  const [bookings, setBookings] = useState([]);

  const { authInfo } = useContext(AuthContext);
  const { token } = authInfo;

  const getBookings = () => {
    const uri = 'http://localhost:9000/graphql';
    const requestBody = {
      query: `query {
      bookings {
        _id
        createdAt
        event {
          _id
          title
          date
        }
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

  const handleCancel = (bookingID) => {
    const uri = 'http://localhost:9000/graphql';
    const requestBody = {
      query: `mutation {
        cancelBooking(bookingID: "${bookingID}") {
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
        getBookings();
      })
      .catch((err) => console.log(err));
  };

  return (
    <React.Fragment>
      <NavigationBar />
      <ThemeProvider theme={defaultTheme}>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                  <Orders bookings={bookings} handleCancel={handleCancel} />
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </ThemeProvider>
    </React.Fragment>
  );
}
