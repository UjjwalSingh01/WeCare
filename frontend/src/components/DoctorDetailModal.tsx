import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useState } from 'react';
import { Alert, Chip, Snackbar, TextField } from '@mui/material';
import axios from 'axios';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500, // Increased width for better form display
  bgcolor: 'background.paper',
  borderRadius: 8, // Rounded corners
  boxShadow: 24,
  p: 4,
};

export default function DoctorDetailModal() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const [fullname, setName] = useState('');
  const [email, setEmail] = useState('');
  const [about, setAbout] = useState('');
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [hospitals, setHospitals] = useState<string[]>([]);

  const [specializationInput, setSpecializationInput] = useState<string>('');
  const [hospitalInput, setHospitalInput] = useState<string>('');

  const handleSpecializationKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && specializationInput.trim()) {
      setSpecializations((prev) => [...prev, specializationInput.trim()]);
      setSpecializationInput('');
    }
  };

  const handleHospitalKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && hospitalInput.trim()) {
      setHospitals((prev) => [...prev, hospitalInput.trim()]);
      setHospitalInput('');
    }
  };

  const handleSpecializationDelete = (chipToDelete: string) => {
    setSpecializations((prev) => prev.filter((chip) => chip !== chipToDelete));
  };

  const handleHospitalDelete = (chipToDelete: string) => {
    setHospitals((prev) => prev.filter((chip) => chip !== chipToDelete));
  };

  async function handleAdd() {
    try {
      const response = await axios.post('http://localhost:3000/api/v1/admin/add-doctor', {
        fullname,
        email,
        specializations,
        hospitals,
        about,
        rating: 5
      })

      if(response.status === 200){
        showSnackbar(`${response.data.message}`, "success");
      }
      else {
        showSnackbar(`${response.data.error}`, "error");
      }

    } catch (error) {
      showSnackbar("Error in Adding Doctor", "error");
      console.error('Error in Adding Doctor: ', error)
    }
  }

  return (
    <div>
      <Button variant="contained" onClick={handleOpen} sx={{ mt: 2 }}>
        Add Doctor
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
            variant="h5"
            component="h2"
            sx={{ mb: 3, fontWeight: 'bold', color: '#1976d2' }}
          >
            Add Doctor Details
          </Typography>

          <TextField
            value={fullname}
            onChange={(e) => setName(e.target.value)}
            id="outlined-name"
            label="Full Name"
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
          />

          <TextField
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            id="outlined-email"
            label="Email"
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
          />

          <TextField
            value={specializationInput}
            onChange={(e) => setSpecializationInput(e.target.value)}
            onKeyPress={handleSpecializationKeyPress}
            label="Specializations"
            variant="outlined"
            fullWidth
            helperText="Press 'Enter' to add specialization"
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }}>
            {specializations.map((spec, index) => (
              <Chip
                key={index}
                label={spec}
                onDelete={() => handleSpecializationDelete(spec)}
                color="primary"
                sx={{ borderRadius: '4px' }}
              />
            ))}
          </Box>

          <TextField
            value={hospitalInput}
            onChange={(e) => setHospitalInput(e.target.value)}
            onKeyPress={handleHospitalKeyPress}
            label="Hospitals"
            variant="outlined"
            fullWidth
            helperText="Press 'Enter' to add hospital"
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }}>
            {hospitals.map((hospital, index) => (
              <Chip
                key={index}
                label={hospital}
                onDelete={() => handleHospitalDelete(hospital)}
                color="secondary"
                sx={{ borderRadius: '4px' }}
              />
            ))}
          </Box>

          <TextField
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            id="outlined-about"
            label="About Doctor"
            multiline
            rows={4}
            fullWidth
            sx={{ mb: 4 }}
          />

          <Button
            onClick={() => {handleAdd()}}
            variant="contained"
            fullWidth
            sx={{
              bgcolor: '#1976d2',
              color: 'white',
              fontWeight: 'bold',
              '&:hover': { bgcolor: '#115293' },
            }}
          >
            Save Doctor
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
