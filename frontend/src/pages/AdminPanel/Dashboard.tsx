import { Box } from '@mui/material';
import InfoCard from '../../components/InfoCard';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { AlertSnackbar } from '../../components/AlertSnackbar';
import { AppointmentGraph } from './components/AppointmentGraph';
import { RecentAppointments } from './components/RecentAppointment';
import { AdminNavbar } from '../../components/Navbar';

interface DashboardDetails {
  stats: {
    totalAdmins: number,
    totalDoctors: number
  },
  appointment: {
    activeAppointment: number,
    recentAppointments: {
      patient: string,
      doctor: string,
      schedule: string,
      status: string,
    }[]
  },
  monthlyData: {
    month: string,
    count: number,
  }[]
}

const monthlyData = [
  { month: '2024-01-01', count: 45 },
  { month: '2024-02-01', count: 68 },
  { month: '2024-03-01', count: 72 },
  { month: '2024-04-01', count: 45 },
  { month: '2024-05-01', count: 68 },
  { month: '2024-06-01', count: 72 },
];

const recentAppointments = [
  {
    id: '1',
    patientName: 'John Doe',
    doctorName: 'Dr. Sarah Smith',
    scheduledAt: new Date(),
    status: 'Pending',
  },
  {
    id: '1',
    patientName: 'John Doe',
    doctorName: 'Dr. Sarah Smith',
    scheduledAt: new Date(),
    status: 'Pending',
  },
  {
    id: '1',
    patientName: 'John Doe',
    doctorName: 'Dr. Sarah Smith',
    scheduledAt: new Date(),
    status: 'Pending',
  },
];

const AdminPanel = () => {
  const [dashboardData, setDashboardData] = useState<DashboardDetails>();
  const [admin, setAdmin] = useState<'SUPER_ADMIN' | 'FACILITY_ADMIN'>();

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
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/admin/dashboard`, {
          withCredentials: true
        })

        const user = JSON.parse(localStorage.getItem('User') || '{}');
        if(user.role === 'SUPER_ADMIN') setAdmin('SUPER_ADMIN');
        else if (user.role === 'FACILITY_ADMIN') setAdmin('FACILITY_ADMIN');

        setDashboardData(response.data.data);
        console.log(response.data.data);
        showSnackbar('Dashboard Details', "success");
        
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Backend error:', error.response?.data);
          showSnackbar(`${error.response?.data}`, "error");
        } else {
          console.error('Unexpected error:', error);
        }
      }
    }

    fetchDetails()
  }, [])

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Navbar */}
      <AdminNavbar userRole={admin} />

      {/* Info Cards Section */}
      <Box>
        <InfoCard heading='Total Admin' data={dashboardData ? dashboardData.stats.totalAdmins : 0} />
        <InfoCard heading='Total Doctors' data={dashboardData ? dashboardData.stats.totalAdmins : 0} />
      </Box>

      <Box sx={{
        display: "flex",
        gap: 6,
        padding: 3
      }}>
        <Box sx={{
          width: "50%"
        }}>
          <AppointmentGraph data={monthlyData} />
        </Box>
        <Box sx={{
          width: "50%"
        }}>
          <RecentAppointments appointments={recentAppointments} />
        </Box>
      </Box>

      <AlertSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        position={{ vertical: 'bottom', horizontal: 'right' }}
      />
    </Box>
  );
};

export default AdminPanel;
