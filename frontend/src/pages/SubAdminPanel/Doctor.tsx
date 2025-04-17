import { Box, Typography, useTheme, useMediaQuery, Container, CircularProgress } from '@mui/material';
import React, { useEffect, useState } from 'react';
import DoctorDetailModal from '../../components/DoctorDetailModal';
import DoctorTable from './components/DoctorTable';
import axios from 'axios';
import { AlertSnackbar } from '../../components/AlertSnackbar';
import { AdminNavbar } from '../../components/Navbar';

export interface Doctor {
  id: string;
  name: string;
  licenseNumber: string;
  totalAppointments: number;
  lastAppointment: string;
  status: 'ACTIVE' | 'INACTIVE';
  added: string;
  verified: boolean;
  rating?: number;
}

const subAdminDoctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. John Smith",
    licenseNumber: "MD123456",
    totalAppointments: 10,
    lastAppointment: 'Sept. 10, 2024',
    status: 'ACTIVE',
    added: "Aug. 10, 2015",
    verified: true,
    rating: 4.5
  },
  {
    id: "2",
    name: "Dr. Emily Johnson",
    licenseNumber: "MD654321",
    totalAppointments: 15,
    lastAppointment: 'Sept. 12, 2024',
    status: 'ACTIVE',
    added: "Jan. 5, 2018",
    verified: false
  },
  {
    id: "3",
    name: "Dr. Michael Chen",
    licenseNumber: "MD789012",
    totalAppointments: 8,
    lastAppointment: 'Sept. 8, 2024',
    status: 'INACTIVE',
    added: "Mar. 20, 2020",
    verified: true,
    rating: 4.2
  },
  {
    id: "4",
    name: "Dr. Sarah Williams",
    licenseNumber: "MD345678",
    totalAppointments: 20,
    lastAppointment: 'Sept. 15, 2024',
    status: 'ACTIVE',
    added: "Nov. 15, 2019",
    verified: true,
    rating: 4.8
  }
];

export const Doctor: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  // const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info'
  });

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const [admin, setAdmin] = useState<'SUPER_ADMIN' | 'FACILITY_ADMIN'>();
  const [doctors, setDoctors] = useState<Doctor[]>(subAdminDoctors);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('User') || '{}');
        let role;
        if(user.role === 'SUPER_ADMIN') {
          role = 'admin';
          setAdmin('SUPER_ADMIN');
        }
        else if (user.role === 'FACILITY_ADMIN') {
          role = 'subadmin'
          setAdmin('FACILITY_ADMIN');
        }

        const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/${role}/doctors`, {
           withCredentials: true }
        );

        showSnackbar(`${response.data.message}`, 'success');
        setDoctors(response.data.data);
      
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Backend error:', error.response?.data);
          showSnackbar(`${error.response?.data}`, "error");
        } else {
          console.error('Unexpected error:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
    <AdminNavbar userRole={admin} />
    <Container maxWidth="xl" sx={{
      p: { xs: 2, md: 4 },
      minHeight: '100vh',
      backgroundColor: theme.palette.background.default
    }}>
      <Box sx={{
        backgroundColor: 'primary.main',
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
        borderRadius: 4,
        p: 4,
        mb: 4,
        boxShadow: theme.shadows[6],
        color: 'common.white'
      }}>
        <Box sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'flex-start' : 'center',
          gap: 2
        }}>
          <Typography variant="h1" sx={{
            fontWeight: 700,
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            textShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}>
            Doctor Management
          </Typography>
          <DoctorDetailModal />
        </Box>
        {!isMobile && (
          <Typography variant="subtitle1" sx={{
            mt: 2,
            opacity: 0.9,
            fontSize: { xs: '0.875rem', md: '1rem' }
          }}>
            Manage medical professionals and their schedules
          </Typography>
        )}
      </Box>

      <Box sx={{
        backgroundColor: 'background.paper',
        borderRadius: 4,
        boxShadow: theme.shadows[2],
        overflow: 'hidden',
        position: 'relative',
        '&:hover': {
          boxShadow: theme.shadows[6]
        },
        transition: theme.transitions.create('box-shadow')
      }}>
        <Box sx={{ 
          p: { xs: 1, sm: 2, md: 3 },
          maxWidth: '100%',
          overflowX: 'auto'
        }}>
          <DoctorTable subAdminDoctors={doctors} />
        </Box>
      </Box>

      <AlertSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        position={{ vertical: 'bottom', horizontal: 'right' }}
      />
    </Container>
    </>
  );
};