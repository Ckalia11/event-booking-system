import React, { useState, useEffect, useRef, useContext } from 'react';
import AuthContext from '../context/authContext';
import NavigationBar from '../components/nav';
import { Box, TextField, Button } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useFormik } from 'formik';
import * as yup from 'yup';
import dayjs from 'dayjs';

const validationSchema = yup.object({
  title: yup.string('Enter the title').required('Email is required'),
  description: yup
    .string('Enter the description')
    .required('Description is required'),
  price: yup.number('Enter the price').required('Price is required'),
  date: yup.date('Enter the date').required('Date is required'),
});

export default function AddEvent() {
  const { authInfo } = useContext(AuthContext);
  const { token } = authInfo;

  const blockInvalidChar = (e) =>
    ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault();

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      price: '',
      date: null,
    },
    validationSchema,
    onSubmit: (values) => {
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
        })
        .catch((err) => {
          console.log(err);
        });
    },
  });

  return (
    <React.Fragment>
      <NavigationBar />
      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        sx={{
          '& .MuiTextField-root': { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete="off"
      >
        <div>
          <TextField
            required
            id="title"
            label="Title"
            title="title"
            autoComplete="title"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.title}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
          />
        </div>
        <div>
          <TextField
            required
            id="description"
            label="Description"
            title="description"
            multiline
            rows={2}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.description}
            error={
              formik.touched.description && Boolean(formik.errors.description)
            }
            helperText={formik.touched.description && formik.errors.description}
          />
        </div>
        <div>
          <TextField
            type="number"
            required
            id="price"
            label="Price"
            title="price"
            onKeyDown={blockInvalidChar}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.price}
            error={formik.touched.price && Boolean(formik.errors.price)}
            helperText={formik.touched.price && formik.errors.price}
          />
        </div>
        <div>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Date"
              title="date"
              id="date"
              required
              disablePast
              onChange={(date) => formik.setFieldValue('date', date)}
              onBlur={() => formik.setFieldTouched('date', true)}
              value={formik.values.date}
              slotProps={{
                textField: {
                  required: true,
                  error: formik.touched.date && Boolean(formik.errors.date),
                  helperText: formik.touched.date ? formik.errors.date : '',
                },
              }}
            />
          </LocalizationProvider>
        </div>
        <div>
          <Button type="submit" variant="contained">
            Submit
          </Button>
        </div>
      </Box>
    </React.Fragment>
  );
}
