import { useLocation } from 'react-router-dom';
import { Paper, Typography, Grid, Button } from '@mui/material';
import AuthContext from '../context/authContext';
import { useContext } from 'react';
import NavigationBar from '../components/nav';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Event() {
  const navigate = useNavigate();

  const { authInfo } = useContext(AuthContext);
  const { token } = authInfo;

  const location = useLocation();
  const ID = location.state.event._id;
  const title = location.state.event.title;
  const description = location.state.event.description;
  const price = location.state.event.price;
  const date = new Date(location.state.event.date);

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);

  const bookEvent = () => {
    const uri = 'http://localhost:9000/graphql';
    const requestBody = {
      query: `mutation {
        bookEvent(eventID: "${ID}") {
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
        navigate('/bookings');
      })
      .catch((err) => console.log(err));
  };

  return (
    <React.Fragment>
      <NavigationBar />
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
          {title}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle1">
              <strong>Event Price:</strong> {price}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1">
              <strong>Event Date:</strong> {formattedDate}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Event Description:</Typography>
            <Typography>{description}</Typography>
          </Grid>
          <Grid item xs={12}>
            {token && (
              <Button onClick={bookEvent} variant="contained">
                Book
              </Button>
            )}
          </Grid>
        </Grid>
      </Paper>
    </React.Fragment>
  );
}
