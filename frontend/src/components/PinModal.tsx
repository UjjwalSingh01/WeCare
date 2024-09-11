import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { TextField } from '@mui/material';

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

export default function PinModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
            label="Enter Pin" 
            variant="outlined" 
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3, // Rounded input field
              },
              mb: 3,
            }}
          />
          <Button variant="contained" sx={{m:2, borderRadius:5, px:2}}>Enter</Button>
        </Box>
      </Modal>
    </div>
  );
}
