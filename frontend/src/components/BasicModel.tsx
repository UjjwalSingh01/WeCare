import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import axios from 'axios';
import { Alert, FormControl, InputLabel, MenuItem, Select, Snackbar } from '@mui/material';

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
  const [removeFacilities, setRemoveFacilities] = useState(false);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  async function onSubmit() {

    try{
        let path = '';
        if(heading === 'Add Admin') {
            path = 'add-admin'
        }
        else if(heading === 'Add Sub Admin') {
            path = 'add-subadmin'
        }

        const response = await axios.post(`http://localhost:3000/api/v1/admin/${path}`, {
            fullname,
            email,
            pin,
        })

        if(response.status === 200){
            showSnackbar(`${response.data.message}`, "success");
            handleClose()
        }
        else {
            showSnackbar(`${response.data.error}`, "error");
            return;
        }

    } catch(error) {
        showSnackbar("Error in Basic Modal", "error");
        console.log('Error in Basic Model: ', error)
    }

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

            {heading === 'Add Admin' && (
              <FormControl fullWidth>
                <InputLabel id="remove-facilities-label">Remove Facilities</InputLabel>
                <Select
                  labelId="remove-facilities-label"
                  id="remove-facilities-select"
                  value={removeFacilities}
                  label="Remove Facilities"
                  onChange={(e) => setRemoveFacilities(e.target.value === 'true')}
                >
                  <MenuItem value="true">True</MenuItem>
                  <MenuItem value="false">False</MenuItem>
                </Select>
              </FormControl>
            )}

            
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
