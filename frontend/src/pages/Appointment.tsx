import { useEffect, useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { TextField, MenuItem, Button, Typography, Snackbar, Alert } from '@mui/material';
import dayjs, {Dayjs} from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import axios from 'axios';
import { DoctorDetails } from './PatientDetail';


// interface DoctorDetails {
//   id: string,
//   fullname: string
// }

interface AppointmentDetails {
  appointmentId: string;
  doctorName: string;
  date: string;
  time: string;
}


const Appointment = () => {
  const [schedule, setSchedule] = useState<Dayjs | null>(null);
  const [physician, setPhysician] = useState('');
  const [reason, setReason] = useState('');
  const [note, setNote] = useState('')
  const [appointments, setAppointments] = useState<AppointmentDetails[]>([
    {
      appointmentId: '1',
      doctorName: 'John Doe',
      date: 'Sept 11, 2020',
      time: '11:00 AM'
    }, 
    {
      appointmentId: '2',
      doctorName: 'Jane Doe',
      date: 'Sept 12, 2020',
      time: '13:00 PM'
    }, 
    {
      appointmentId: '3',
      doctorName: 'Edo John',
      date: 'Sept 11, 2020',
      time: '15:00 PM'
    }
  ])

  const [doctors, setDoctors] = useState<DoctorDetails[]>([
    {
      id: '1',
      fullname: 'JOhn Doe'
    },
    {
      id: '2',
      fullname: 'Jane Doe'
    } , 
    {
      id: '3',
      fullname: 'Edo Jane'
    }
  ])

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  // useEffect 
  // for getting all the doctors
  // for getting active appointments
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get('/')

        setAppointments(response.data.result)
        setDoctors(response.data.doctors)

      } catch (error) {
        showSnackbar("Error in Fetching Doctors & Appointments", "error");
        console.error('Error in Fetching Doctors & Appointments: ', error)
      }
    }
    
    fetchDetails()
  },[])

  const allowedHours = [11, 13, 15, 17, 19]; // 11 AM, 1 PM, 3 PM, 5 PM, 7 PM

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


  async function onSubmit() {
    // CHECK 1: SCHEDULE , REASON , PHYSICIAN MUST NOT BE EMPTY
    // CHECK 2: USE SNACKBAR & ALERT TO SHOW ERRORS
    // IF SLOT IS NOT AVAILABLE SHOW SNACKBAR

    try {
      if(schedule === null || reason === "" || physician === ""){ 
        showSnackbar("Error in Form", "error");
      }
      else {
        const response = await axios.post('http://localhost:3000/api/v1/appointment/make-appointment', {
          physician,
          reason,
          note,
          date: schedule.format('MMMM D, YYYY'),
          time: schedule.format('hh:mm A')
        })
  
        if(response.status === 200){
          showSnackbar("Appointment Completed", "success");
        }
        else {
          showSnackbar(`${response.data.error}`, "error");
        }
      }
    } catch (error) {
      showSnackbar("Error in Appointment Submission", "error");
      console.error('Error in Appointment Submission: ', error)
    }
  }

  async function handleCancel(id: string) {
    try {
      await axios.post('http://localhost:3000/api/v1/appointment/cancel-appointment', {
        id
      })

      showSnackbar("Appointment Cancelled Successfully", "success");

    } catch (error) {
      showSnackbar("Error in Cancelling Appointments", "error");
      console.error('Error in Cancelling Appointments: ', error)
    }
  }

  return (
      <div className="w-screen h-screen flex relative">
        
        <section className="bg-red-400 w-[25%] h-full">

        </section>

        <section className="bg-emerald-300 w-[75%] h-full flex justify-end items-center">
          
          <div className="bg-purple-600 w-full sm:w-[90%] md:w-[80%] lg:w-[70%] h-full sm:h-[80%] lg:h-[70%] mr-4 sm:mr-10 lg:mr-20 p-4 sm:p-6 md:p-16 flex-col justify-center items-center transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl">
            
            <div className="">
                <Typography
                    variant="h3"
                    gutterBottom
                    align="left"
                    className="text-blue-700 font-extrabold text-3xl sm:text-4xl lg:text-5xl"  // Responsive font size
                >
                    WeCare
                </Typography>
                <Typography
                    variant="h6"
                    gutterBottom
                    align="left"
                    className="text-gray-600 text-base sm:text-lg lg:text-xl"  // Responsive font size
                >
                    Book Your Appointments .....
                </Typography>
            </div>
            
            
            <div className="py-4 sm:py-6">
                <TextField
                    id="outlined-select-currency"
                    select
                    label="Select"
                    fullWidth
                    helperText="Please select your Physician"
                    value={physician}
                    onChange={handleChange}
                >
                    {doctors.map((doctor, index) => (
                        <MenuItem key={index} value={doctor.id}>
                            {doctor.fullname}
                        </MenuItem>
                    ))}
                </TextField>

                <div className="flex flex-col md:flex-row gap-4 md:gap-16 justify-around mt-4">
                    <TextField 
                        id="outlined-multiline-static"
                        label="Reason Of Appointment" 
                        multiline
                        rows={4}
                        fullWidth
                        margin="normal"
                        onChange={(e) => {setReason(e.target.value)}}
                    />
                    
                    <TextField 
                        id="outlined-multiline-static"
                        label="Additional Note" 
                        multiline
                        rows={4}
                        fullWidth
                        margin="normal"
                        onChange={(e) => {setNote(e.target.value)}}
                    />
                </div>

                {/* DateTimePicker */}
                <div className="mt-7 flex justify-center items-center">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker
                            label="Schedule Appointment"
                            value={schedule}
                            onChange={(newValue) => setSchedule(newValue)}
                            shouldDisableTime={shouldDisableTime}
                            sx={{
                                width: '80%',
                                borderRadius: '100px',
                            }}
                        />
                    </LocalizationProvider>
                </div>

                {/* Button */}
                <div className="mt-7 flex justify-center items-center">
                <Button
                    variant="contained"
                    onClick={() => {onSubmit()}}
                    sx={{
                        width: '60%',   
                        md: '60%',       
                        marginTop: 5,
                        background: 'linear-gradient(135deg, #6DD5FA 30%, #2980B9 90%)',
                        color: 'white',
                        padding: '12px 20px',
                        fontWeight: 'bold',
                        borderRadius: '50px',
                        boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.4)',  
                        transition: 'all 0.3s ease',  
                        '&:hover': {
                            background: 'linear-gradient(135deg, #2980B9 30%, #6DD5FA 90%)',
                            boxShadow: '0px 12px 30px rgba(0, 0, 0, 0.5)',
                        },
                        '&:active': {
                            background: 'linear-gradient(135deg, #1F6D92 30%, #1A4C7E 90%)',  
                            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.5)',  
                            transform: 'translateY(4px)',
                        },
                    }}
                >
                Book Appointment
                </Button>
                </div>
            </div>
          </div>
        </section>

        <div className="bg-blue-400 w-[90%] sm:w-[425px] h-[50%] sm:h-[80%] shadow-2xl flex justify-center items-center rounded-tl-[100px] rounded-br-[100px] absolute top-[20%] sm:top-[10%] left-[10%] sm:left-[25%] transform -translate-x-1/2 rounded-lg transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-2xl">
            <div className="bg-red-700 h-[90%] w-[90%]">
                active Appointment
                {appointments.map(appointment => {
                  return (
                    <div>
                      {appointment.doctorName}
                      {appointment.date} {appointment.time}
                      <Button onClick={() => {handleCancel(appointment.appointmentId)}} variant='text'>Cancel</Button>
                    </div>
                  )
                })}
            </div>
        </div>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          sx={{
            width: '400px', // Control width
            borderRadius: '8px',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
            padding: '0',
            '& .MuiSnackbarContent-root': {
              padding: 0, // Remove default padding
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
            color: '#fff', // Text color
            fontSize: '1.1rem', // Larger font
            fontWeight: 'bold', // Bold text
            borderRadius: '8px', // Rounded corners
            padding: '16px', // Padding inside Alert
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', // Add shadow
            width: '100%', // Take up the full Snackbar width
            '& .MuiAlert-icon': {
              fontSize: '28px', // Larger icon size
            },
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      </div>
  );
};

export default Appointment;
