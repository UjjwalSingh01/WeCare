import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Alert, Snackbar, TextField } from '@mui/material';
import axios from 'axios';
import { useState } from 'react';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: 7, // Rounded corners
    boxShadow: '0px 10px 25px rgba(0, 0, 0, 0.2)', // Softer shadow
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

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
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

      const response = await axios.post('http://localhost:3000/api/v1/admin/admin-login', {
        email,
        pin
      }, {
        withCredentials: true
      })

      if(response.status === 200){
        showSnackbar('Admin Login Successful', "success");
        
        if(response.data.message === "Admin") navigate('/AdminPanel')
        else navigate('/SubAdminPanel')

      } else {
        showSnackbar('Admin Login UnSuccessful', "error");
        return
      }

      window.location.reload();
      handleClose()
    } catch (error) {
      showSnackbar('Admin Login UnSuccessful', "error");
      console.error('Error in Logging Admin: ', error)
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
            borderRadius: 5
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
            }}
          >
            User Verification
          </Typography>
          <Typography 
            id="modal-modal-description" 
            sx={{ my: 2, textAlign: 'center', color: '#7F8C8D' }}
          >
            Enter Admin Pin
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
          <Button onClick={() => {LoginAdmin()}} variant="contained" sx={{m:2, borderRadius:5, px:2}}>Enter</Button>
        </Box>
      </Modal>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
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
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          sx={{
            background: snackbarSeverity === 'success'
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
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
