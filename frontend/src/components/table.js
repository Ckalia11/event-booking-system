import * as React from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Button } from '@mui/material';
import Title from '../pages/title';
import formatDate from '../helpers/formatDate';
import { Link as LinkRouter } from 'react-router-dom';

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
              <TableCell>
                <Link
                  component={LinkRouter}
                  to={'/events/' + booking.event._id}
                >
                  {booking.event.title}
                </Link>
              </TableCell>
              <TableCell>{formatDate(booking.event.date)}</TableCell>
              <TableCell>{formatDate(booking.createdAt)}</TableCell>
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
