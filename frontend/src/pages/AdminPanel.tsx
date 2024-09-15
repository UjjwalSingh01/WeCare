import { Divider, Typography, Box } from '@mui/material';
import AdminNavbar from '../components/Navbar';
import InfoCard from '../components/InfoCard';
import BasicModal from '../components/BasicModel';
import RemoveModal from '../components/RemoveModal';
import DoctorDetailModal from '../components/DoctorDetailModal';
import ScheduleTable from '../components/ScheduleTable';
import { useEffect, useState } from 'react';
import axios from 'axios';


interface MonthDetails {
    currentMonthAppointments: number,
    lastMonthAppointments: number
}

interface RemoveDetails {
    id: string, 
    fullname: string
}

export interface AppointmentsDetails {
    doctor: string,
    patient: string,
    date: string,
    time: string,
    status: 'ACTIVE' | 'CANCELLED' | 'COMPLETED'
}

const AdminPanel = () => {
   const [name, setName] = useState('')
   const [total, setTotal] = useState(0)
   const [monthly, setMonthly] = useState<MonthDetails>()
   const [appointments, setAppointments] = useState<AppointmentsDetails[]>([])
   const [doctors, setDoctor] = useState<RemoveDetails[]>([])
   const [doctorCount, setDoctorCount] = useState(0)
   const [admins, setAdmins] = useState<RemoveDetails[]>([])
   const [subadmins, setSubAdmins] = useState<RemoveDetails[]>([])

   useEffect(() => {
    const fetchDetails = async () => {
        try {
            
            const response = await axios.get('http://localhost:3000/api/v1/admin/admin-dashboard')

            setName(response.data.name)
            setDoctor(response.data.doctors)
            setDoctorCount(response.data.doctorCount)
            setAdmins(response.data.admins)
            setSubAdmins(response.data.subadmins)
            setTotal(response.data.total)
            setMonthly(response.data.monthly)
            setAppointments(response.data.appointments)

        } catch (error) {
            console.error('Error in Admin Panel: ', error)
        }
    }

    fetchDetails()
   }, [])

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Navbar */}
      <AdminNavbar />

      {/* Header Section */}
      <Box sx={{ backgroundColor: '#fff', boxShadow: 3, mb: 4 }}>
        <Typography
          variant='h2'
          sx={{
            p: 4,
            ml: { xs: 2, md: 4 },
            fontSize: { xs: '1.75rem', md: '2.5rem' },
            fontWeight: 'bold',
            color: '#333',
          }}
        >
          Welcome, {name}
        </Typography>
      </Box>

      {/* Info Cards Section */}
      <div className="grid xl:grid-cols-3">
            <InfoCard data={total} />
            <InfoCard data={monthly} />
            <InfoCard data={doctorCount} />
      </div>

      <Divider sx={{ mb: 4 }} />

      {/* Doctor Section */}
      <Box sx={{ px: { xs: 2, md: 4 }, mb: 4 }}>
        <Typography
          variant='h4'
          sx={{
            mb: 2,
            fontWeight: 'bold',
            color: '#333',
            fontSize: { xs: '1.5rem', md: '2rem' },
          }}
        >
          Doctors
        </Typography>
        <Box
          sx={{
            display: 'flex',
            gap: 3,
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center', 
            justifyContent: 'space-around', 
          }}
        >
          <DoctorDetailModal />
          <RemoveModal heading='Remove Doctor' data={doctors} />
        </Box>
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* Admin Section */}
      <Box sx={{ px: { xs: 2, md: 4 }, mb: 4 }}>
        <Typography
          variant='h4'
          sx={{
            mb: 2,
            fontWeight: 'bold',
            color: '#333',
            fontSize: { xs: '1.5rem', md: '2rem' },
          }}
        >
          Admins
        </Typography>
        <Box
          sx={{
            display: 'flex',
            gap: 3,
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center', 
            justifyContent: 'space-around', 
          }}
        >
          <BasicModal heading='Add Admin' action='Add' />
          <RemoveModal heading='Remove Admin' data={admins} />
        </Box>
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* Sub Admin Section */}
      <Box sx={{ px: { xs: 2, md: 4 }, mb: 4 }}>
        <Typography
          variant='h4'
          sx={{
            mb: 2,
            fontWeight: 'bold',
            color: '#333',
            fontSize: { xs: '1.5rem', md: '2rem' },
          }}
        >
          Sub Admins
        </Typography>
        <Box
            sx={{
                display: 'flex',
                gap: 3,
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: 'center', 
                justifyContent: 'space-around', 
            }}
            >
            <BasicModal heading='Add Sub Admin' action='Add' />
            <RemoveModal heading='Remove Sub Admin' data={subadmins} />
        </Box>
      </Box>

      <Divider /> 
      <Box
        sx={{
            p:5
        }}
      >
        <Typography
          align='center'
          variant='h4'
          sx={{
            mb: 4,
            fontWeight: 'bold',
            color: '#333',
            fontSize: { xs: '1.5rem', md: '2rem' },
          }}
        >
          Appointments
        </Typography>
        <ScheduleTable appointments={appointments} /> 
      </Box>
    </Box>
  );
};

export default AdminPanel;
