import { useEffect, useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { TextField, MenuItem, Button, Typography, Card, CardContent, CardActions, Box, useTheme, useMediaQuery } from '@mui/material';
import dayjs, {Dayjs} from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import axios from 'axios';
import { DoctorDetails } from './PatientDetail';
import image from '../assets/doctor3.jpg'
import image1 from '../assets/doc1.png'
// import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { AlertSnackbar } from '../components/AlertSnackbar';


interface AppointmentDetails {
  appointmentId: string;
  doctorName: string;
  date: string;
  time: string;
}

const Appointment = () => {
  const theme = useTheme();
  const isXlScreen = useMediaQuery(theme.breakpoints.up('xl'));

  const [schedule, setSchedule] = useState<Dayjs | null>(null);
  const [physician, setPhysician] = useState('');
  const [reason, setReason] = useState('');
  const [note, setNote] = useState('')
  const [appointments, setAppointments] = useState<AppointmentDetails[]>([])
  const [doctors, setDoctors] = useState<DoctorDetails[]>([])

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
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/appointment/getAppointments`, {
          withCredentials: true
        })

        setAppointments(response.data.appointments)
        setDoctors(response.data.doctors)

      } catch (error) {
        showSnackbar("Error in Fetching Doctors & Appointments", "error");
        console.error('Error in Fetching Doctors & Appointments: ', error)
      }
    }
    
    fetchDetails()
  },[])

  const allowedHours = [11, 13, 15, 17, 19];

  const shouldDisableTime = (value: dayjs.Dayjs, view: 'hours' | 'minutes' | 'seconds') => {
    if (view === 'hours') {
      return !allowedHours.includes(value.hour());
    }
    if (view === 'minutes' || view === 'seconds') {
      return value.minute() !== 0 || value.second() !== 0;
    }
    return false;
  };

  // Handler for dropdown change
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhysician(event.target.value);
  };

  async function handleSubmit() {
    try {
      if(!schedule || !reason || !physician ){ 
        showSnackbar("Error in Form", "error");
        return;
      }
      
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_API}/appointment/makeAppointment`, {
        physician,
        reason,
        note,
        date: schedule.format('MMMM D, YYYY'),
        time: schedule.format('hh:mm A')
      }, {
        withCredentials: true
      })

      showSnackbar(`${response.data.message}`, "success");
      window.location.reload();

    } catch (error) {
      console.error('Error in Appointment Submission: ', error)
      showSnackbar("Error in Appointment Submission", "error");
    }
  }

  async function handleCancel(id: string) {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_BACKEND_API}/appointment/cancelAppointment/${id}`, {
        withCredentials: true,
      })

      showSnackbar(`${response.data.message}`, "success");
      window.location.reload();
      
    } catch (error) {
      showSnackbar("Error in Cancelling Appointments", "error");
      console.error('Error in Cancelling Appointments: ', error)
    }
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: { xs: 'column', xl: 'row' },
      background: `linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.9)), url(${image})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      {/* Left Image Section (xl only) */}
      {isXlScreen && (
        <Box sx={{
          width: '30%',
          backgroundImage: `url(${image1})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }} />
      )}

      {/* Main Content */}
      <Box sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        p: { xs: 2, md: 4 },
        position: 'relative'
      }}>

        {/* Appointment Form */}
        <Box sx={{
          width: '100%',
          maxWidth: 800,
          bgcolor: 'background.paper',
          borderRadius: 4,
          boxShadow: 3,
          p: { xs: 2, md: 4 },
          mb: 4
        }}>
          <Typography variant="h3" sx={{
            fontWeight: 'bold',
            color: 'primary.main',
            mb: 2,
            fontSize: { xs: '2rem', md: '2.5rem' }
          }}>
            WeCare
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary', mb: 4 }}>
            Book Your Appointment
          </Typography>

          <TextField
            select
            fullWidth
            label="Select Physician"
            value={physician}
            onChange={handleChange}
            helperText="Please select your physician"
            sx={{ mb: 3 }}
          >
            {doctors.map((doctor) => (
              <MenuItem key={doctor.id} value={doctor.id}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  {doctor.fullName}
                  <Link to="/DoctorDetailPage" state={doctor.id} style={{ color: 'primary.main' }}>
                    View Details
                  </Link>
                </Box>
              </MenuItem>
            ))}
          </TextField>

          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            gap: 3,
            mb: 3 
          }}>
            <TextField
              label="Reason for Appointment"
              multiline
              rows={4}
              fullWidth
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <TextField
              label="Additional Notes"
              multiline
              rows={4}
              fullWidth
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </Box>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="Schedule Appointment"
              value={schedule}
              onChange={setSchedule}
              shouldDisableTime={shouldDisableTime}
              sx={{ width: '100%', mb: 3 }}
            />
          </LocalizationProvider>

          <Button
            fullWidth
            variant="contained"
            onClick={handleSubmit}
            sx={{
              py: 2,
              background: 'linear-gradient(135deg, #6DD5FA 30%, #2980B9 90%)',
              fontSize: '1.1rem',
              '&:hover': {
                background: 'linear-gradient(135deg, #2980B9 30%, #6DD5FA 90%)'
              }
            }}
          >
            Book Appointment
          </Button>
        </Box>

        {/* Active Appointments */}
        <Box sx={{
          width: '100%',
          bgcolor: 'background.paper',
          borderRadius: 4,
          boxShadow: 3,
          p: { xs: 2, md: 4 },
          display: isXlScreen ? 'none' : 'block'
        }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            Active Appointments
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 2,
            maxHeight: 400,
            overflowY: 'auto'
          }}>
            {appointments.map((appointment) => (
              <Card key={appointment.appointmentId}>
                <CardContent>
                  <Typography variant="h6">{appointment.doctorName}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {appointment.date} | {appointment.time}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                  <Button 
                    onClick={() => handleCancel(appointment.appointmentId)}
                    color="error"
                    variant="outlined"
                  >
                    Cancel
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Box>
        </Box>

        {/* XL Screen Appointments */}
        {isXlScreen && (
          <Box sx={{
            position: 'absolute',
            left: '-25%',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '30%',
            bgcolor: 'background.paper',
            borderRadius: 4,
            boxShadow: 3,
            p: 2,
            maxHeight: '60vh',
            overflowY: 'auto'
          }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              Active Appointments
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {appointments.map((appointment) => (
                <Card key={appointment.appointmentId}>
                  <CardContent>
                    <Typography variant="h6">{appointment.doctorName}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {appointment.date} | {appointment.time}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'flex-end' }}>
                    <Button 
                      onClick={() => handleCancel(appointment.appointmentId)}
                      color="error"
                      variant="outlined"
                    >
                      Cancel
                    </Button>
                  </CardActions>
                </Card>
              ))}
            </Box>
          </Box>
        )}
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

export default Appointment;