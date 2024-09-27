import { Box, Button, Typography, Modal, MenuItem, TextField, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import { useState } from 'react';
import { DoctorDetails } from '../pages/PatientDetail';

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
  outline: 'none',
};


export default function RemoveModal({ heading, data }: { heading: string, data: DoctorDetails[] }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [removeId, setRemoveId] = useState<string>('')

  const member = data;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRemoveId(event.target.value);
    // setRemoveId(selectedValue);
  };  

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  async function OnRemove() {
    try {

        let path = '';
        if(heading === 'Remove Doctor') {
            path = 'remove-doctor'
        }
        else if(heading === 'Remove Admin'){
            path = 'remove-admin'
        }
        else if(heading === 'Remove Sub Admin'){
            path = 'remove-subadmin'
        }

        const response = await axios.post(`http://localhost:3000/api/v1/admin/${path}`, {
            removeId
        })

        if(response.status === 200){
            showSnackbar(`${response.data.message}`, "success");
        }
        else {
            showSnackbar(`${response.data.error}`, 'error');
            return;
        }

        handleClose();

    } catch (error) {
        showSnackbar("Error in Removing Modal", "error");
        console.error('Error in Removing Modal: ', error)
    }
  }

  return (
    <div>
      <Button variant="contained" color="error" onClick={handleOpen}>
        {heading}
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h5" component="h2" sx={{ mb: 2 }}>
            {heading}
          </Typography>

          <TextField
            id="outlined-select-admin"
            select
            label='Select'
            fullWidth
            value={removeId}
            onChange={handleChange}
            sx={{ mb: 3 }}
          >
            {member.map((option, index) => (
              <MenuItem key={index} value={option.id}>
                {option.fullname}
              </MenuItem>
            ))}
          </TextField>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="outlined" color="primary" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={() => {OnRemove()}} variant="contained" color="error">
              Remove
            </Button>
          </Box>
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
