import { Alert, Snackbar } from '@mui/material';
// import { useTheme } from '@mui/material/styles';
import { SyntheticEvent } from 'react';

interface AlertSnackbarProps {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
  onClose: (event?: SyntheticEvent | Event, reason?: string) => void;
  autoHideDuration?: number;
  position?: {
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
  };
}

export const AlertSnackbar: React.FC<AlertSnackbarProps> = ({
  open,
  message,
  severity,
  onClose,
  autoHideDuration = 4000,
  position = { vertical: 'bottom', horizontal: 'right' }
}) => {
  // const theme = useTheme();

  const handleClose = (event?: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    onClose(event, reason);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      anchorOrigin={position}
      sx={{
        width: '400px',
        borderRadius: '8px',
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
        padding: '0',
        '& .MuiSnackbarContent-root': {
          padding: 0,
        },
      }}
    >
      <Alert
        severity={severity}
        sx={{
          background: severity === 'success'
            ? 'linear-gradient(90deg, rgba(70,203,131,1) 0%, rgba(129,212,250,1) 100%)'
            : 'linear-gradient(90deg, rgba(229,57,53,1) 0%, rgba(244,143,177,1) 100%)',
          color: '#fff',
          fontSize: '1.1rem',
          fontWeight: 'bold',
          borderRadius: '8px',
          padding: '16px',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          width: '100%', 
          '& .MuiAlert-icon': {
            fontSize: '28px',
          },
        }}
        onClose={handleClose}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};