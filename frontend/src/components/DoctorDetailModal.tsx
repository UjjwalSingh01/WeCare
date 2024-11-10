import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useState } from 'react';
import { Alert, Chip, List, ListItem, ListItemButton, ListItemText, Snackbar, TextField } from '@mui/material';
import axios from 'axios';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  maxHeight: '90vh',
  bgcolor: 'background.paper',
  borderRadius: 8,
  boxShadow: 24,
  p: 4,
  overflowY: 'auto',
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
  const [admin, setAdmin] = useState('')
  const [adminName, setAdminName] = useState('')
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [addressSuggestions, setAddressSuggestions] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<{ lat: number; lon: number; display_name: string } | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string[]>([])
  const [about, setAbout] = useState('');
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [hospitals, setHospitals] = useState<string[]>([]);

  const [phoneNumberInput, setPhoneNumberInput] = useState<string>('')
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

  const handlePhoneNumberKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && phoneNumberInput.trim()) {
      setPhoneNumber((prev) => [...prev, phoneNumberInput.trim()]);
      setPhoneNumberInput('');
    }
  };

  const handlePhoneNumberDelete = (chipToDelete: string) => {
    setPhoneNumber((prev) => prev.filter((chip) => chip !== chipToDelete));
  };

  const fetchAddressSuggestions = async (query: string) => {
    try {
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: query,
          format: 'json',
          addressdetails: 1,
        },
      });
      setAddressSuggestions(response.data || []);
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
      showSnackbar('Error fetching address suggestions', 'error');
    }
  };

  // Handle address input change
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAddress(value);
    if (value.trim().length > 2) {
      fetchAddressSuggestions(value);
    } else {
      setAddressSuggestions([]);
    }
  };

  // Handle address selection
  const handleAddressSelect = (address: any) => {
    setSelectedAddress({
      lat: parseFloat(address.lat),
      lon: parseFloat(address.lon),
      display_name: address.display_name,
    });
    setAddress(address.display_name); 
    setAddressSuggestions([]); 
  };


  async function handleAdd() {
    try {
      if (!selectedAddress) {
        showSnackbar('Please select an address from the suggestions', 'error');
        return;
      }
  
      const { lat, lon, display_name } = selectedAddress;

      const response = await axios.post('http://localhost:3000/api/v1/admin/add-doctor', {
        fullname,
        email,
        specializations,
        hospitals,
        about,
        admin,
        adminName,
        rating: 5,
        address: display_name,
        latitude: lat,
        longitude: lon,
        phoneNumber,
      });

      if (response.status === 200) {
        showSnackbar(`${response.data.message}`, "success");
      } else {
        showSnackbar(`${response.data.error}`, "error");
        return;
      }

      window.location.reload();
    } catch (error) {
      showSnackbar("Error in Adding Doctor", "error");
      console.error('Error in Adding Doctor: ', error);
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
            value={adminName}
            onChange={(e) => setAdminName(e.target.value)}
            id="outlined-email"
            label="Admin Name"
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
          />

          <TextField
            value={admin}
            onChange={(e) => setAdmin(e.target.value)}
            id="outlined-email"
            label="Admin Email"
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
          />

          <TextField
            value={address}
            onChange={handleAddressChange}
            label="Address"
            fullWidth
            sx={{ mb: 2 }}
          />
          
          {addressSuggestions.length > 0 && (
            <List sx={{ maxHeight: 150, overflowY: 'auto', mb: 2, border: '1px solid #ccc', borderRadius: 1 }}>
              {addressSuggestions.map((suggestion, index) => (
                <ListItem key={index} disablePadding>
                  <ListItemButton onClick={() => handleAddressSelect(suggestion)}>
                    <ListItemText primary={suggestion.display_name} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}
          {/* Selected Address */}
          {selectedAddress && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Selected: {selectedAddress.display_name}
            </Typography>
          )}

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
            value={phoneNumberInput}
            onChange={(e) => setPhoneNumberInput(e.target.value)}
            onKeyPress={handlePhoneNumberKeyPress}
            label="Phone Number"
            variant="outlined"
            fullWidth
            helperText="Press 'Enter' to add Phone Number"
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }}>
            {phoneNumber.map((phoneNumber, index) => (
              <Chip
                key={index}
                label={phoneNumber}
                onDelete={() => handlePhoneNumberDelete(phoneNumber)}
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
