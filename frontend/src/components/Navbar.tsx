import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Alert, Avatar, Button, Snackbar } from '@mui/material';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  const navigate = useNavigate()

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };
  
  async function handleLogout() {
    try {
      await axios.post('http://localhost:3000/api/v1/admin/logout', {
        withCredentials: true
      })

      showSnackbar("Logout Successfully", "success");
      
      navigate('/')
    } catch (error) {
      showSnackbar("Error in Logout", "error");
      console.error('Error in Logout: ', error)
    }
  }
  
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{height:75}}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography 
            variant="h6" 
            align='left' 
            component="div" 
            sx={{ 
              flexGrow: 1,
              fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' } 
            }}
          >
            WeCare
          </Typography>
          <Avatar
              alt="Username"
              src="/static/images/avatar/1.jpg"
            />
            <Typography variant="h6" noWrap>
              &nbsp; Admin
            </Typography>
            <Button sx={{ color: 'white' }} onClick={() => {handleLogout()}}>Logout</Button>
        </Toolbar>
      </AppBar>
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
    </Box>
  );
}