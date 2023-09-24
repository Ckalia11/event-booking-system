import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import * as yup from 'yup';

const dateValidationSchema = yup.object({
  date: yup.date('Enter the date').required('Date is required'),
});

function datePicker({ formik }) {
  return (
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
          },
        }}
      />
    </LocalizationProvider>
  );
}

export { datePicker as DatePicker, dateValidationSchema };
