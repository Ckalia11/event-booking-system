import React, { useContext } from 'react';
import AuthContext from '../context/authContext';
import NavigationBar from '../components/nav';
import { Box, TextField, Button, Typography } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useState } from 'react';

const validationSchema = yup.object({
  title: yup.string('Enter the title').required('Title is required'),
  description: yup
    .string('Enter the description')
    .required('Description is required'),
  price: yup.number('Enter the price').required('Price is required'),
  date: yup.date('Enter the date').required('Date is required'),
});

export default function AddEvent() {
  const navigate = useNavigate();

  const { authInfo } = useContext(AuthContext);
  const { token } = authInfo;

  const blockInvalidChar = (e) =>
    ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault();

  const [filename, setFilename] = useState('');

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      price: '',
      date: null,
    },
    validationSchema,
    onSubmit: (values) => {
      if (!values.date || isNaN(new Date(values.date))) {
        formik.setErrors({ date: 'Invalid date' });
      }
      const title = values.title;
      const description = values.description;
      const price = values.price;
      const date = values.date.toDate();

      const uri = 'http://localhost:9000/graphql';
      const requestBody = {
        query: `mutation {
      createEvent(eventInput: {title: "${title}" description: "${description}" price: ${price} date: "${date.toISOString()}"}) {
        title
        description
        price
        date
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
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log(data);
          navigate('/events');
        })
        .catch((err) => {
          console.log(err);
        });
    },
  });

  const defaultTheme = createTheme();

  const onKeyDown = (e) => {
    e.preventDefault();
  };

  return (
    <React.Fragment>
      <NavigationBar />
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Container maxWidth="sm">
              <Typography
                component="h2"
                variant="h4"
                align="center"
                color="text.primary"
                gutterBottom
              >
                Add an event
              </Typography>
            </Container>
            <Box
              component="form"
              onSubmit={formik.handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                required
                id="title"
                label="Title"
                title="title"
                fullWidth
                margin="normal"
                autoComplete="title"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.title}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
                inputProps={{ maxLength: 50 }}
              />
              <TextField
                required
                id="description"
                label="Description"
                title="description"
                fullWidth
                margin="normal"
                multiline
                rows={2}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.description}
                error={
                  formik.touched.description &&
                  Boolean(formik.errors.description)
                }
                helperText={
                  formik.touched.description && formik.errors.description
                }
                inputProps={{ maxLength: 200 }}
              />
              <TextField
                type="number"
                required
                id="price"
                label="Price"
                title="price"
                fullWidth
                margin="normal"
                onKeyDown={blockInvalidChar}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.price}
                error={formik.touched.price && Boolean(formik.errors.price)}
                helperText={formik.touched.price && formik.errors.price}
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date"
                  title="date"
                  id="date"
                  fullWidth
                  margin="normal"
                  required
                  disablePast
                  onChange={(date) => formik.setFieldValue('date', date)}
                  onBlur={() => formik.setFieldTouched('date', true)}
                  value={formik.values.date}
                  slotProps={{
                    textField: {
                      style: { marginTop: '16px', marginBottom: '8px' },
                      required: true,
                      error: formik.touched.date && Boolean(formik.errors.date),
                      helperText: formik.touched.date ? formik.errors.date : '',
                      onKeyDown: onKeyDown,
                    },
                  }}
                />
              </LocalizationProvider>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Submit
              </Button>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </React.Fragment>
  );
}
