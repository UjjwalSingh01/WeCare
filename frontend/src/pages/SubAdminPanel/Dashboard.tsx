import { Typography, Box, useTheme, useMediaQuery, Container, IconButton, Skeleton } from '@mui/material';
import InfoCard from '../../components/InfoCard';
import { useEffect, useState } from 'react';
import axios from 'axios';
import MonthInfoCard from '../../components/MonthInfoCard';
import { RefreshRounded } from '@mui/icons-material';
import AppointmentTable from './components/AppointmentTable';
import { AlertSnackbar } from '../../components/AlertSnackbar';
import { AdminNavbar } from '../../components/Navbar';

export interface MonthlyDetails {
  currentMonthAppointments: number;
  lastMonthAppointments: number;
}

export interface SubAppointmentsDetails {
  id: string;
  patientName: string;
  doctorName: string;
  reason: string;
  date: string;
  time: string;
  status: string;
}

export const dummyAppointments: SubAppointmentsDetails[] = [
  {
    id: 'APT-1001',
    patientName: 'Sarah Johnson',
    doctorName: 'Dr. Michael Chen - Cardiology',
    reason: 'Routine cardiac checkup and consultation about occasional chest discomfort',
    date: '2024-03-15',
    time: '09:30 AM',
    status: 'PENDING'
  },
  {
    id: 'APT-1002',
    patientName: 'James Wilson',
    doctorName: 'Dr. Emily Rodriguez - Dermatology',
    reason: 'Follow-up for psoriasis treatment',
    date: '2024-03-15',
    time: '10:45 AM',
    status: 'CONFIRMED'
  },
  {
    id: 'APT-1003',
    patientName: 'Maria Garcia',
    doctorName: 'Dr. David Kim - Orthopedics',
    reason: 'Post-op check for knee replacement surgery',
    date: '2024-03-16',
    time: '02:15 PM',
    status: 'COMPLETED'
  },
  {
    id: 'APT-1004',
    patientName: 'Robert Smith',
    doctorName: 'Dr. Jennifer Lee - Neurology',
    reason: 'Migraine evaluation and treatment plan adjustment',
    date: '2024-03-17',
    time: '11:00 AM',
    status: 'IN_PROGRESS'
  },
  {
    id: 'APT-1005',
    patientName: 'Linda Brown',
    doctorName: 'Dr. Andrew Patel - Pediatrics',
    reason: 'Childhood vaccination and developmental milestone check',
    date: '2024-03-18',
    time: '08:30 AM',
    status: 'CANCELLED'
  },
  {
    id: 'APT-1006',
    patientName: 'William Taylor',
    doctorName: 'Dr. Samantha Green - Endocrinology',
    reason: 'Diabetes management and insulin pump consultation',
    date: '2024-03-19',
    time: '03:45 PM',
    status: 'NO_SHOW'
  },
  {
    id: 'APT-1007',
    patientName: 'Emily Davis',
    doctorName: 'Dr. Christopher Wong - Gastroenterology',
    reason: 'Chronic acid reflux evaluation',
    date: '2024-03-20',
    time: '01:15 PM',
    status: 'PENDING'
  },
  {
    id: 'APT-1008',
    patientName: 'Daniel Martinez',
    doctorName: 'Dr. Olivia Brown - Psychiatry',
    reason: 'Anxiety management and medication review',
    date: '2024-03-21',
    time: '10:00 AM',
    status: 'CONFIRMED'
  },
  {
    id: 'APT-1009',
    patientName: 'Sophia Anderson',
    doctorName: 'Dr. Ethan Wilson - Ophthalmology',
    reason: 'Annual eye exam and contact lens fitting',
    date: '2024-03-22',
    time: '09:00 AM',
    status: 'COMPLETED'
  },
  {
    id: 'APT-1010',
    patientName: 'Michael Thompson',
    doctorName: 'Dr. Hannah Nguyen - Rheumatology',
    reason: 'Lupus treatment progress evaluation',
    date: '2024-03-23',
    time: '11:30 AM',
    status: 'IN_PROGRESS'
  },
  {
    id: 'APT-1011',
    patientName: 'Emma White',
    doctorName: 'Dr. Alexander Garcia - ENT',
    reason: 'Chronic sinusitis treatment follow-up',
    date: '2024-03-24',
    time: '02:00 PM',
    status: 'CANCELLED'
  },
  {
    id: 'APT-1012',
    patientName: 'Joshua Harris',
    doctorName: 'Dr. Sophia Martinez - Urology',
    reason: 'Kidney stone analysis and prevention plan',
    date: '2024-03-25',
    time: '04:15 PM',
    status: 'NO_SHOW'
  },
  {
    id: 'APT-1013',
    patientName: 'Olivia Clark',
    doctorName: 'Dr. Benjamin Lee - Oncology',
    reason: 'Chemotherapy schedule discussion',
    date: '2024-03-26',
    time: '10:30 AM',
    status: 'PENDING'
  },
  {
    id: 'APT-1014',
    patientName: 'Matthew Lewis',
    doctorName: 'Dr. Chloe Adams - Physical Therapy',
    reason: 'Post-stroke rehabilitation progress check',
    date: '2024-03-27',
    time: '03:00 PM',
    status: 'CONFIRMED'
  },
  {
    id: 'APT-1015',
    patientName: 'Ava Walker',
    doctorName: 'Dr. Nathan Brown - Allergy & Immunology',
    reason: 'Seasonal allergy immunotherapy consultation',
    date: '2024-03-28',
    time: '08:45 AM',
    status: 'COMPLETED'
  }
];

const SubAdminPanel = () => {
  const [admin, setAdmin] = useState<'SUPER_ADMIN' | 'FACILITY_ADMIN'>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [loading, setLoading] = useState(true);

  const [name, setName] = useState('John Doe');
  const [monthly, setMonthly] = useState<MonthlyDetails>({
    currentMonthAppointments: 0,
    lastMonthAppointments: 0
  });
  const [totalAppointments, setTotalAppointments] = useState<number>(0);
  const [appointments, setAppointments] = useState<SubAppointmentsDetails[]>(dummyAppointments);

const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info'
  });

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/subAdmin/dashboard`,
          { withCredentials: true }
        );
        
        const user = JSON.parse(localStorage.getItem('User') || '{}');
        if(user.role === 'SUPER_ADMIN') setAdmin('SUPER_ADMIN');
        else if (user.role === 'FACILITY_ADMIN') setAdmin('FACILITY_ADMIN');

        setName(response.data.name);
        setTotalAppointments(response.data.totalAppointments);
        setMonthly({
          currentMonthAppointments: response.data.monthlyDetails.currentMonth,
          lastMonthAppointments: response.data.monthlyDetails.lastMonth
        });
        setAppointments(response.data.recentAppointments);

        showSnackbar(`${response.data.message}`, 'success');

      } catch (error) {
        if (axios.isAxiosError(error)) {
          showSnackbar(`${error.response?.data}`, 'error');
          console.error('Backend error:', error.response?.data);
        } else {
          console.error('Unexpected error:', error);
        }
      } finally {
        setLoading(false);
      }
    };
  
    fetchDetails();
  }, []);

  return (
    <>
    <Box sx={{ 
      backgroundColor: theme.palette.background.default,
      display: 'flex',
      flexDirection: 'column'
    }}>
      <AdminNavbar userRole={admin} />

      {/* Main Content Container */}
      <Container maxWidth="xl" sx={{ 
        flex: 1, 
        py: { xs: 2, md: 4 },
        px: { xs: 1, md: 2 }
      }}>
        {/* Header Section */}
        <Box sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'flex-start' : 'center',
          gap: 2,
          mb: 4,
          p: { xs: 2, md: 4 },
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          borderRadius: 4,
          color: 'common.white',
          boxShadow: theme.shadows[4]
        }}>
          {loading ? (
            <Skeleton variant="text" width={200} height={40} />
          ) : (
            <Typography variant="h1" sx={{
              fontWeight: 700,
              fontSize: { xs: '1.75rem', md: '2.5rem' },
              textShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}>
              Welcome, {name}
            </Typography>
          )}
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {/* <BasicModal 
              heading='Update Profile' 
              action='Update'
            /> */}
            <IconButton
              color="secondary"
              sx={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.2)'
                }
              }}
            >
              <RefreshRounded />
            </IconButton>
          </Box>
        </Box>

        {/* Stats Section */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
          gap: { xs: 2, md: 4 },
          mb: { xs: 3, md: 5 }
        }}>
          {loading ? (
            <>
              <Skeleton variant="rounded" height={120} />
              <Skeleton variant="rounded" height={120} />
              <Skeleton variant="rounded" height={120} />
            </>
          ) : (
            <>
              <InfoCard 
                data={totalAppointments} 
                heading='Total Appointments'
              />
              <MonthInfoCard 
                data={monthly} 
              />
            </>
          )}
        </Box>

        {/* Appointments Table */}
        <Box sx={{
          backgroundColor: 'background.paper',
          borderRadius: 4,
          boxShadow: theme.shadows[2],
          overflow: 'hidden',
          '&:hover': {
            boxShadow: theme.shadows[4]
          },
          transition: theme.transitions.create('box-shadow')
        }}>
          {loading ? (
            <Box sx={{ p: 3 }}>
              <Skeleton variant="rounded" height={400} />
            </Box>
          ) : (
            <Box sx={{ 
              maxWidth: '100%', 
              overflowX: 'auto',
              p: { xs: 1, md: 2 }
            }}>
              <AppointmentTable setAppointments={setAppointments} appointments={appointments} />
            </Box>
          )}
        </Box>
      </Container>
    </Box>
    <AlertSnackbar
      open={snackbar.open}
      message={snackbar.message}
      severity={snackbar.severity}
      onClose={() => setSnackbar({ ...snackbar, open: false })}
      position={{ vertical: 'bottom', horizontal: 'right' }}
    />
    </>
  );
};

export default SubAdminPanel;