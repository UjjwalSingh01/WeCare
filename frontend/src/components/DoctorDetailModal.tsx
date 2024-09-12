import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useState } from 'react';
import { Chip, TextField } from '@mui/material';
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

  const [name, setName] = useState('');
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
      const response = await axios.post('/', {
        name,
        email,
        specializations,
        hospitals,
        about
      })

      console.log(response.data)

    } catch (error) {
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
            value={name}
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
    </div>
  );
}
