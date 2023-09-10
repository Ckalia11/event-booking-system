import { Link as LinkRouter } from 'react-router-dom';
import Link from '@mui/material/Link';

export default function CustomLink({ to, children, ...props }) {
  return (
    <>
      <Link variant="body2">
        <LinkRouter to={to} {...props}>
          {children}
        </LinkRouter>
      </Link>
    </>
  );
}
