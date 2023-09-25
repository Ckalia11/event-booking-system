import { Paper, Typography, Grid, Button } from '@mui/material';
import AuthContext from '../context/authContext';
import NavigationBar from '../components/nav';
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SimpleSnackbar from '../components/snackbar';
import formatDate from '../helpers/formatDate';

export default function Event() {
  const [event, setEvent] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [showSnackbar, setShowSnackbar] = useState(false);

  let { eventId } = useParams();

  const { authInfo } = useContext(AuthContext);
  const { token, userId } = authInfo;

  const uri = 'http://localhost:9000/graphql';

  const navigate = useNavigate();

  const getEvent = () => {
    let content = `event(eventID: "${eventId}") {
            _id
            title
            description
            price
            date
            creator {
              _id
            }
          }`;
    if (token) {
      content += `bookings {
        event {
          _id
        }
      }`;
    }
    const query = `query {
          ${content}
        }`;
    fetch(uri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({ query }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setEvent(data.data.event);
        if (data.data.bookings) {
          const extractedIds = data.data.bookings.map(
            (booking) => booking.event._id
          );
          setBookings(extractedIds);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(getEvent, []);

  const bookEvent = () => {
    const uri = 'http://localhost:9000/graphql';
    const requestBody = {
      query: `mutation {
        bookEvent(eventID: "${event._id}") {
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
        setShowSnackbar(true);
        setTimeout(() => {
          setShowSnackbar(false);
          navigate('/bookings');
        }, 1000);
      })
      .catch((err) => console.log(err));
  };

  let bookEventButton;
  if (event) {
    if (token) {
      if (userId === event.creator._id) {
        bookEventButton = <p>You are the creator of this event.</p>;
      } else if (bookings.includes(event._id)) {
        bookEventButton = <p>You have alredy booked this event.</p>;
      } else {
        bookEventButton = (
          <Button onClick={bookEvent} variant="contained">
            Book
          </Button>
        );
      }
    } else {
      bookEventButton = <p>Sign in to book this event.</p>;
    }
  }

  return (
    <React.Fragment>
      <NavigationBar />
      {event && (
        <Paper
          elevation={3}
          style={{
            padding: 16,
            marginTop: 30,
            maxWidth: 600,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          <Typography variant="h4" gutterBottom>
            {event.title}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="subtitle1">
                <strong>Event Price:</strong> {event.price}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">
                <strong>Event Date:</strong> {formatDate(event.date)}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">Event Description:</Typography>
              <Typography>{event.description}</Typography>
            </Grid>
            <Grid item xs={12}>
              {bookEventButton}
            </Grid>
          </Grid>
        </Paper>
      )}
      <SimpleSnackbar
        showSnackbar={showSnackbar}
        handleShowSnackbar={(val) => {
          setShowSnackbar(val);
        }}
        message="Event booked sucessfully"
      />
    </React.Fragment>
  );
}
