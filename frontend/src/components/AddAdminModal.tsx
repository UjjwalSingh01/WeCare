import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import axios from 'axios';
import { FormControl, InputLabel, MenuItem, Select, useTheme } from '@mui/material';
import { AlertSnackbar } from './AlertSnackbar';
import AddIcon from '@mui/icons-material/Add';


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

export default function AddAdminModal() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const theme = useTheme();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [role, setRole] = useState('');
  const [permission, setPermission] = useState('');

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info'
  });

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  async function onSubmit() {
    try {
      // Validate pins match
      if (pin !== confirmPin) {
        showSnackbar("Pins do not match!", "error");
        return;
      }

      const payload = {
        fullName,
        email,
        pin,
        confirmPin,
        role,
        permission
      };

      const response = await axios.post(`${import.meta.env.VITE_BACKEND_API}/admin/addAdmin`, payload, {
        withCredentials: true
      });

      showSnackbar(`${response.data.message}`, "success");
      window.location.reload();
      handleClose();

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
      <Button
        onClick={handleOpen}
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        sx={{
          borderRadius: 50,
          px: 3,
          textTransform: 'none',
          boxShadow: theme.shadows[2],
        }}
      >
        Add Admin
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center' }}>
            Add Admin
          </Typography>

          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              onChange={(e) => setFullName(e.target.value)}
              label="Full Name"
              variant="outlined"
              fullWidth
              InputLabelProps={{ style: { color: '#1976d2' }}}
            />
            <TextField
              onChange={(e) => setEmail(e.target.value)}
              label="Email"
              variant="outlined"
              fullWidth
              InputLabelProps={{ style: { color: '#1976d2' }}}
            />
            <TextField
              onChange={(e) => setPin(e.target.value)}
              label="Pin"
              type="password"
              variant="outlined"
              fullWidth
              InputLabelProps={{ style: { color: '#1976d2' }}}
            />
            <TextField
              onChange={(e) => setConfirmPin(e.target.value)}
              label="Confirm Pin"
              type="password"
              variant="outlined"
              fullWidth
              InputLabelProps={{ style: { color: '#1976d2' }}}
            />

            <FormControl fullWidth>
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                value={role}
                label="Role"
                onChange={(e) => setRole(e.target.value)}
              >
                <MenuItem value="SUPER_ADMIN">Super Admin</MenuItem>
                <MenuItem value="FACILITY_ADMIN">Facility Admin</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="permission-label">Permission</InputLabel>
              <Select
                labelId="permission-label"
                value={permission}
                label="Permission"
                onChange={(e) => setPermission(e.target.value)}
              >
                <MenuItem value="FULL_ACCESS">Full Access</MenuItem>
                <MenuItem value="READ_WRITE">Read & Write</MenuItem>
              </Select>
            </FormControl>

            <Button
              onClick={onSubmit}
              variant="contained"
              sx={{
                mt: 3,
                bgcolor: '#1976d2',
                boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                borderRadius: '20px',
                px: 4,
                py: 1,
              }}
            >
              Add Admin
            </Button>
          </Box>
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