import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import NavigationBar from '../components/nav';
import { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/authContext';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Button } from '@mui/material';
import Title from '../components/title';
import formatDate from '../helpers/formatDate';
import { Link as LinkRouter } from 'react-router-dom';

const defaultTheme = createTheme();

export default function Bookings() {
  const [bookings, setBookings] = useState([]);

  const { authInfo } = useContext(AuthContext);
  const { token } = authInfo;

  const uri = 'http://localhost:9000/graphql';

  const getBookings = () => {
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

  const handleCancelBooking = (bookingID) => {
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
      .then((_) => {
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
                  <Title>Bookings</Title>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Event Name</TableCell>
                        <TableCell>Event Date</TableCell>
                        <TableCell>Booking Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {bookings.map((booking) => (
                        <TableRow key={booking._id}>
                          <TableCell>
                            <Link
                              component={LinkRouter}
                              to={'/events/' + booking.event._id}
                            >
                              {booking.event.title}
                            </Link>
                          </TableCell>
                          <TableCell>
                            {formatDate(booking.event.date)}
                          </TableCell>
                          <TableCell>{formatDate(booking.createdAt)}</TableCell>
                          <TableCell>
                            <Button
                              size="small"
                              onClick={() => handleCancelBooking(booking._id)}
                            >
                              Cancel Booking
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </ThemeProvider>
    </React.Fragment>
  );
}
