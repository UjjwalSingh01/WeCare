import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Avatar, Button, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  ExitToApp as ExitToAppIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { AlertSnackbar } from './AlertSnackbar';

export const AdminNavbar: React.FC<{ userRole: 'SUPER_ADMIN' | 'FACILITY_ADMIN' | undefined }> = ({ userRole }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info'
  });

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  async function handleLogout() {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_API}/admin/logout`, {
        withCredentials: true
      });
      showSnackbar("Logout Successfully", "success");
      navigate('/');
    } catch (error) {
      showSnackbar("Error in Logout", "error");
      console.error('Error in Logout: ', error);
    }
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{ height: 75 }}>
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              alt="Username"
              src="/static/images/avatar/1.jpg"
            />
            <Button
              color="inherit"
              onClick={handleMenuOpen}
              aria-controls="admin-menu"
              aria-haspopup="true"
            >
              Admin
            </Button>
            <Menu
              id="admin-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              {userRole === 'SUPER_ADMIN' ? (
                <>
                  <MenuItem onClick={() => { handleMenuClose(); navigate('/admin/dashboard'); }}>
                    <ListItemIcon>
                      <DashboardIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Dashboard</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={() => { handleMenuClose(); navigate('/admin/administration'); }}>
                    <ListItemIcon>
                      <PeopleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Administration</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={() => { handleMenuClose(); navigate('/admin/doctor'); }}>
                    <ListItemIcon>
                      <SettingsIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Doctor</ListItemText>
                  </MenuItem>
                </>
              ) : (
                <>
                  <MenuItem onClick={() => { handleMenuClose(); navigate('/subadmin/dashboard'); }}>
                    <ListItemIcon>
                      <DashboardIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Dashboard</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={() => { handleMenuClose(); navigate('/subadmin/doctor'); }}>
                    <ListItemIcon>
                      <SettingsIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Doctor</ListItemText>
                  </MenuItem>
                </>
              )}

              <hr />
              <MenuItem onClick={() => { handleMenuClose(); handleLogout(); }}>
                <ListItemIcon>
                  <ExitToAppIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Logout</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <AlertSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        position={{ vertical: 'bottom', horizontal: 'right' }}
      />
    </Box>
  );
}