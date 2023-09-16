import * as React from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Button } from '@mui/material';
import Title from '../pages/title';

const formatDate = (date) => {
  const bookingDate = new Date(date);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(bookingDate);
};

export default function Orders({ bookings, handleCancel }) {
  return (
    <React.Fragment>
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
              <TableCell>{booking.event.title}</TableCell>
              <TableCell>{formatDate(booking.event.date)}</TableCell>
              <TableCell>{formatDate(booking.event.date)}</TableCell>
              <TableCell>
                <Button size="small" onClick={() => handleCancel(booking._id)}>
                  Cancel Booking
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  );
}
