import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useEffect, useState, useContext } from 'react';
import NavigationBar from '../components/nav';
import { Link as LinkRouter, useNavigate } from 'react-router-dom';
import AuthContext from '../context/authContext';

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Events() {
  const navigate = useNavigate();

  const { authInfo } = useContext(AuthContext);
  const { token } = authInfo;

  const [events, setEvents] = useState([]);

  const getEvents = () => {
    const uri = 'http://localhost:9000/graphql';
    const requestBody = {
      query: `query {
          events {
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
        setEvents(data.data.events);
      })
      .catch((err) => console.log(err));
  };

  useEffect(getEvents, []);

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <NavigationBar />
      <main>
        <Box
          sx={{
            bgcolor: 'background.paper',
            pt: 8,
            pb: 2,
          }}
        >
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              Events
            </Typography>
            <Typography
              variant="h5"
              align="center"
              color="text.secondary"
              paragraph
            >
              Browse popular events and book them.
            </Typography>
            {token && (
              <Stack
                sx={{ pt: 4 }}
                direction="row"
                spacing={2}
                justifyContent="center"
              >
                <Button
                  component={LinkRouter}
                  to="/new-event"
                  variant="contained"
                >
                  Create Event
                </Button>
              </Stack>
            )}
          </Container>
        </Box>
        <Container sx={{ py: 6 }} maxWidth="md">
          <Grid container spacing={4}>
            {events.map((event, index) => (
              <Grid item key={event._id} xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <CardMedia
                    component="div"
                    sx={{
                      // 16:9
                      pt: '56.25%',
                    }}
                    image="https://source.unsplash.com/random?wallpapers"
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {event.title}
                    </Typography>
                    <Typography>{event.description}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      onClick={() => {
                        navigate(`/events/${event._id}`);
                      }}
                    >
                      View
                    </Button>
                    {/* <Button size="small">Edit</Button> */}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
      {/* Footer */}
      {/* <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
        <Typography variant="h6" align="center" gutterBottom>
          Footer
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p"
        >
          Something here to give the footer a purpose!
        </Typography>
      </Box> */}
      {/* End footer */}
    </ThemeProvider>
  );
}
