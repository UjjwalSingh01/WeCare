import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Avatar } from '@mui/material';

export default function Navbar() {
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
            //   sx={{ width: 64, height: 64, mb: 2, border: `2px solid ${theme.palette.background.paper}` }}
            />
            <Typography variant="h6" noWrap>
              &nbsp; Admin
            </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}