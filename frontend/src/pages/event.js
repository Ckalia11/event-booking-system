import { useLocation } from 'react-router-dom';
import { Paper, Typography, Grid, Button } from '@mui/material';
import AuthContext from '../context/authContext';
import { useContext } from 'react';
import NavigationBar from '../components/nav';
import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SimpleSnackbar from '../components/snackbar';
import formatDate from '../helpers/formatDate';

export default function Event() {
  const [event, setEvent] = useState(null);
  let { eventId } = useParams();
  console.log(event);

  const getEvent = () => {
    const uri = 'http://localhost:9000/graphql';
    const requestBody = {
      query: `query {
          event(eventID: "${eventId}") {
            _id
            title
            description
            price
            date
            creator {
              _id
            }
          }
        }`,
    };
    fetch(uri, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setEvent(data.data.event);
      })
      .catch((err) => console.log(err));
  };

  useEffect(getEvent, []);

  const [showSnackbar, setShowSnackbar] = useState(false);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowSnackbar(false);
  };

  const navigate = useNavigate();

  const { authInfo } = useContext(AuthContext);
  const { token, userId } = authInfo;

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
      } else {
        bookEventButton = (
          <Button onClick={bookEvent} variant="contained">
            Book
          </Button>
        );
      }
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
        open={showSnackbar}
        onClose={handleCloseSnackbar}
        message="Event booked sucessfully"
      />
    </React.Fragment>
  );
}
