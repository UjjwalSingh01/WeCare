import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useState } from 'react';
import { Chip, FormControl, InputLabel, List, ListItem, ListItemButton, ListItemText, MenuItem, Select, TextField } from '@mui/material';
import axios from 'axios';
import { AlertSnackbar } from './AlertSnackbar';

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

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info'
  });

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
      setSnackbar({ open: true, message, severity });
  };

  const [fullName, setName] = useState('');
  const [email, setEmail] = useState('');
  const [licenseNumber, setLicenseNumber] = useState<string>("")
  const [address, setAddress] = useState('');
  const [addressSuggestions, setAddressSuggestions] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<{ lat: number; lon: number; display_name: string } | null>(null);
  const [officePhone, set0fficePhone] = useState<string>('');
  const [about, setAbout] = useState('');
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [hospitalAffiliations, setHospitalAffiliations] = useState<string[]>([]);
  const [specializationInput, setSpecializationInput] = useState<string>('');
  const [hospitalInput, setHospitalInput] = useState<string>('');
  const [availability, setAvailability] = useState<boolean>(true);

  const handleSpecializationKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && specializationInput.trim()) {
      setSpecialties((prev) => [...prev, specializationInput.trim()]);
      setSpecializationInput('');
    }
  };

  const handleHospitalKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && hospitalInput.trim()) {
      setHospitalAffiliations((prev) => [...prev, hospitalInput.trim()]);
      setHospitalInput('');
    }
  };

  const handleSpecializationDelete = (chipToDelete: string) => {
    setSpecialties((prev) => prev.filter((chip) => chip !== chipToDelete));
  };

  const handleHospitalDelete = (chipToDelete: string) => {
    setHospitalAffiliations((prev) => prev.filter((chip) => chip !== chipToDelete));
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
  
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_API}/subadmin/addDoctor`, {
        fullName,
        email,
        licenseNumber,
        specialties,
        hospitalAffiliations,
        officePhone: officePhone,
        about,
        availability,
        rating: 5,
        address: display_name,
        latitude: lat,
        longitude: lon,
      }, {
        withCredentials: true
      });
  
      showSnackbar(`${response.data.message}`, "success");
      window.location.reload();
  
    } catch (error) {
      if (axios.isAxiosError(error)) {
        showSnackbar(`${error.response?.data}`, 'error');
        console.error('Backend error:', error.response?.data);
      } else {
        console.error('Unexpected error:', error);
      }
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
            value={fullName}
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
            value={licenseNumber}
            onChange={(e) => setLicenseNumber(e.target.value)}
            id="outlined-licenseNumber"
            label="License Number"
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
            <InputLabel id="availability-label">Availability</InputLabel>
            <Select
              labelId="availability-label"
              id="availability"
              value={availability.toString()}
              onChange={(e) => setAvailability(e.target.value === "true")}
              label="Availability"
            >
              <MenuItem value="true">TRUE</MenuItem>
              <MenuItem value="false">FALSE</MenuItem>
            </Select>
          </FormControl>

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
            {specialties.map((spec, index) => (
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
            {hospitalAffiliations.map((hospital, index) => (
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
            value={officePhone}
            onChange={(e) => set0fficePhone(e.target.value)}
            label="Office Number"
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
          />

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
