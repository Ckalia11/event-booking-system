import React from 'react';
import Alert from '@mui/material/Alert';

const SimpleAlert = ({ severity, onClose, message }) => {
  return (
    <Alert sx={{ mb: 2 }} severity={severity} onClose={onClose}>
      {message}
    </Alert>
  );
};

export default SimpleAlert;
