import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { TextField } from '@mui/material';
import axios from 'axios';
import { useState } from 'react';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { AlertSnackbar } from './AlertSnackbar';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 7,
  boxShadow: '0px 10px 25px rgba(0, 0, 0, 0.2)',
  p: 4,
};

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  pin: z.string().length(6, 'Pin must be exactly 6 digits').regex(/^\d{6}$/, 'Pin must only contain digits'),
});

export default function PinModal() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('')

  const navigate = useNavigate()

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info'
  });

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  async function LoginAdmin() {
    try {
      const validation = loginSchema.safeParse({
        email,
        pin
      })
      if(!validation.success){
        validation.error.errors.forEach((error) => {
          console.log(error.message)
          showSnackbar(`${error.message}`, "error");
        });
        return;
      }

      const response = await axios.post(`${import.meta.env.VITE_BACKEND_API}/admin/adminLogin`, {
        email, pin
      }, {
        withCredentials: true
      })

      localStorage.setItem('User', JSON.stringify(response.data.data));
      showSnackbar(`${response.data.message}`, "success");
      
      if(response.data.data.role === 'SUPER_ADMIN') navigate('/admin/dashboard');
      else if(response.data.data.role === 'FACILITY_ADMIN') navigate('/subadmin/dashboard');

      handleClose()
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Backend error:', error.response?.data);
        showSnackbar(`${error.response?.data}`, "error");
      } else {
        console.error('Unexpected error:', error);
      }
    }
  }

  return (
    <div>
      <Button onClick={handleOpen}>Admin</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
          borderRadius: 5,
        }}
      >
        <Box sx={style}>
          <Typography 
            id="modal-modal-title" 
            variant="h5" 
            component="h2"
            sx={{
              fontWeight: 'bold',
              color: '#2C3E50',
              textAlign: 'center',
              mb: 2
            }}
          >
            Admin Login
          </Typography>
          <TextField 
            fullWidth 
            id="outlined-basic" 
            label="Email" 
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined" 
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
              },
              mb: 3,
            }}
          />
          <TextField 
            fullWidth 
            id="outlined-basic" 
            label="Enter Pin" 
            onChange={(e) => setPin(e.target.value)}
            variant="outlined" 
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
              },
              mb: 3,
            }}
          />
          <Button 
            onClick={() => {LoginAdmin()}} 
            variant="contained" 
            fullWidth
            sx={{
              borderRadius:5, 
              px:2,
            }}
          >
            Login
          </Button>
        </Box>
      </Modal>
      <AlertSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        position={{ vertical: 'bottom', horizontal: 'right' }}
      />
    </div>
  );
}
