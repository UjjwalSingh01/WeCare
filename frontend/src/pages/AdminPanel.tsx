import { Divider, Typography, Box } from '@mui/material';
import AdminNavbar from '../components/Navbar';
import InfoCard from '../components/InfoCard';
import BasicModal from '../components/BasicModel';
import RemoveModal from '../components/RemoveModal';
import DoctorDetailModal from '../components/DoctorDetailModal';
import ScheduleTable from '../components/AdminScheduleTable';
import { useEffect, useState } from 'react';
import axios from 'axios';
import MonthInfoCard from '../components/MonthInfoCard';


export interface MonthDetails {
    currentMonthAppointments: number,
    lastMonthAppointments: number
}

interface RemoveDetails {
    id: string, 
    fullname: string
}

export interface AppointmentsDetails {
    doctorname: string,
    patientname: string,
    date: string,
    time: string,
    status: 'ACTIVE' | 'CANCELLED' | 'COMPLETED'
}

const AdminPanel = () => {
   const [name, setName] = useState('Admin')
   const [total, setTotal] = useState(10)
   const [monthly, setMonthly] = useState<MonthDetails>({
    currentMonthAppointments: 10,
    lastMonthAppointments: 5
   })
   const [appointments, setAppointments] = useState<AppointmentsDetails[]>([
    {
      doctorname: 'Dr. Jai',
      patientname: 'John Doe',
      date: 'September 23, 2024',
      time: '11:00 AM',
      status: 'ACTIVE'
    } , 
    {
      doctorname: 'Dr. dev',
      patientname: 'Jane Doe',
      date: 'November 23, 2024',
      time: '01:00 PM',
      status: 'CANCELLED' 
    } , 
    {
      doctorname: 'Dr. Hahaha',
      patientname: 'Edo Hon',
      date: 'JUly 23, 2024',
      time: '11:00 AM',
      status: 'COMPLETED'
    }
   ])
   const [doctors, setDoctor] = useState<RemoveDetails[]>([])
   const [doctorCount, setDoctorCount] = useState(15)
   const [admins, setAdmins] = useState<RemoveDetails[]>([])
   const [subadmins, setSubAdmins] = useState<RemoveDetails[]>([])

   useEffect(() => {
    const fetchDetails = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/v1/admin/admin-dashboard', {
              withCredentials: true
            })

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
            <InfoCard heading='Total Appointments' data={total} />
            <MonthInfoCard data={monthly} />
            <InfoCard heading='Total Doctors' data={doctorCount} />
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
