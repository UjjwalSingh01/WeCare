import { useEffect, useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { TextField, MenuItem, Button, Typography } from '@mui/material';
import dayjs, {Dayjs} from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import axios from 'axios';

const currencies = [
  {
    value: 'USD',
    label: '$',
  },
  {
    value: 'EUR',
    label: '€',
  },
  {
    value: 'BTC',
    label: '฿',
  },
  {
    value: 'JPY',
    label: '¥',
  },
];


interface DoctorDetails {
  id: string,
  name: string
}


const Appointment = () => {
  const [schedule, setSchedule] = useState<Dayjs | null>(null);
  const [physician, setPhysician] = useState('');
  const [reason, setReason] = useState('');
  const [note, setNote] = useState('')

  const [doctors, setDoctors] = useState<DoctorDetails[]>()

  // useEffect 
  // for getting all the doctors
  // for getting active appointments
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get('/')

        setDoctors(response.data.doctors)

      } catch (error) {
        console.error('Error in Fetching Doctors: ', error)
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

    if(schedule === null || reason === "" || physician === ""){ 
      
    }
    else {
      const response = await axios.post('/', {
        physician,
        reason,
        note,
        date: schedule.format('MM/DD/YYYY')
      })

      console.log(response.data)
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
                    {currencies.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                    {/* {doctors.map((doctor, index) => (
                        <MenuItem key={index} value={doctor.name}>
                            {doctor.name}
                        </MenuItem>
                    ))} */}
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
            </div>
        </div>
      </div>
  );
};

export default Appointment;
