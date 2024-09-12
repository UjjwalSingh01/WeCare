import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import axios from 'axios';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: '10px', 
  boxShadow: 24,
  p: 4,
};

export default function BasicModal({ heading, action,} : { heading: string; action: string; }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [fullname, setFullname] = useState('')
  const [email, setEmail] = useState('')
  const [pin, setPin] = useState('')
//   const [allowRemove, setAllowRemove] = useState(false);

  async function onSubmit() {

    try{
        if(action === 'Update') {

        }
        if(action === 'Add') {

        }

        const response = await axios.post('', {
            fullname,
            email,
            pin,
            // allowRemove
        })

        console.log(response.data)

    } catch(error) {
        console.log('Error in Basic Model: ', error)
    }

    handleClose()
  }

  return (
    <div>
      <Button
        variant="contained"
        onClick={handleOpen}
        sx={{ 
            bgcolor: '#1976d2', 
            // borderRadius: '20px', 
            px: 3, 
            py: 1 
        }} 
      >
        {heading}
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center' }} 
          >
            {heading}
          </Typography>

          <Box
            component="form"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2, 
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              onChange={(e) => setFullname(e.target.value)}
              id="outlined-name"
              label="Full Name"
              variant="outlined"
              fullWidth
              InputLabelProps={{ style: { color: '#1976d2' } }} 
            />
            <TextField
              onChange={(e) => setEmail(e.target.value)}
              id="outlined-email"
              label="Email"
              variant="outlined"
              fullWidth
              InputLabelProps={{ style: { color: '#1976d2' } }} 
            />
            <TextField
              onChange={(e) => setPin(e.target.value)}
              id="outlined-pin"
              label="Pin"
              variant="outlined"
              fullWidth
              InputLabelProps={{ style: { color: '#1976d2' } }} 
            />
          </Box>

          <Button
            onClick={() => {onSubmit()}}
            variant="contained"
            color="primary"
            sx={{
              mt: 3,
              bgcolor: '#1976d2', 
              boxShadow: '0 4px 10px rgba(0,0,0,0.2)', 
              borderRadius: '20px', 
              px: 4,
              py: 1,
            }}
          >
            {action}
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
