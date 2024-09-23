import { Typography, Box } from '@mui/material';
import Navbar from '../components/Navbar';
import InfoCard from '../components/InfoCard';
import { useEffect, useState } from 'react';
import axios from 'axios';
import DoctorDetailModal from '../components/DoctorDetailModal';
import BasicModal from '../components/BasicModel';
import MonthInfoCard from '../components/MonthInfoCard';
import SubAdminScheduleTable from '../components/SubAdminScheduleTable';

interface MonthlyDetails {
  currentMonthAppointments: number;
  lastMonthAppointments: number;
}

export interface SubAppointmentsDetails {
  patientName: string;
  reason: string;
  date: string;
  time: string;
  status: 'ACTIVE' | 'CANCELLED' | 'COMPLETED';
}

const SubAdminPanel = () => {
  const [name, setName] = useState('John Doe');
  const [monthly, setMonthly] = useState<MonthlyDetails>({
    currentMonthAppointments: 22,
    lastMonthAppointments:92
  });
  const [totalAppointments, setTotalAppointments] = useState(192)
  const [appointments, setAppointments] = useState<SubAppointmentsDetails[]>([
    {
      patientName: 'John Doe',
      reason: 'Headache',
      date: 'September 23, 2024',
      time: '11:00 AM',
      status: 'ACTIVE'
    }
  ]);

  // useEffect(() => {
  //   const fetchDetails = async () => {
  //     try {
  //       const response = await axios.get('');

  //       setName(response.data.name);
  //       setMonthly(response.data.monthly);
  //       setTotalAppointments(response.data.totalAppointments)
  //       setAppointments(response.data.appointments);
  //     } catch (error) {
  //       console.error('Error in Fetching Notification: ', error);
  //     }
  //   };

  //   fetchDetails();
  // }, []);

  return (
    <div className='w-screen min-h-screen bg-gray-100'>
      <Navbar />

      {/* Header Section */}
      <Box
        sx={{
          padding: { xs: 2, md: 4 },
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#ffffff',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          marginBottom: 3,
        }}
      >
        <Typography
          variant='h4'
          sx={{
            fontWeight: 'bold',
            color: '#333',
            paddingLeft: { xs: 1, md: 2 }, // Adjust left padding for smaller screens
            fontSize: { xs: '1.5rem', md: '2rem' }, // Adjust font size for smaller screens
          }}
        >
          Welcome, {name}
        </Typography>

        <BasicModal heading='Sub Admin Details' action='Update' />
      </Box>

      {/* Content Section */}
      <Box sx={{ padding: { xs: 2, md: 4 } }}>
        {/* Info Cards and Doctor Detail Modal */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, // Responsive grid
            gap: { xs: 2, md: 4 }, // Space between cards adjusts with screen size
            marginBottom: { xs: 3, md: 5 }, // Adjust margin for responsiveness
          }}
        >
          <MonthInfoCard data={monthly} />
          <InfoCard data={totalAppointments} heading='Total Appointment' />
          <DoctorDetailModal />
        </Box>

        {/* Schedule Table */}
        <Box
          sx={{
            padding: { xs: 2, md: 4 },
            backgroundColor: '#fff',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            borderRadius: '10px',
            overflowX: 'auto', // Handle table overflow on small screens
          }}
        >
          <SubAdminScheduleTable appointments={appointments} />
        </Box>
      </Box>
    </div>
  );
};

export default SubAdminPanel;
