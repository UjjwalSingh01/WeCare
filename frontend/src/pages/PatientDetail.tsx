import { useEffect, useState } from 'react';
import { z } from 'zod';
import { Card, TextField, Button, Typography, FormControl, RadioGroup, FormControlLabel, Radio, MenuItem, Box, useMediaQuery, useTheme } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import image from '../assets/doctorf.avif'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AlertSnackbar } from '../components/AlertSnackbar';

const schema = z.object({
  email: z.string().email('Enter Correct Email Format'),
  fullName: z.string().min(2, 'Name Must Contain Atleast 2 Characters'),
  // phoneNumber :z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),
  phoneNumber :z.string().length(10, 'Phone Number Must Contain Only 10 digits'),
  dob: z.string(),
  gender: z.enum(['MALE', 'FEMALE' , 'OTHER']),
  address: z.string(),
  emergencyContactName: z.string().optional(),
  emergencyContactNumber: z.string().length(10, 'Phone Number Must Contain Only 10 digits'),
  allergies: z.string().optional(),
  currentMedications: z.string().optional(),
  medicalHistory:z.string().optional(),
  familyMedicalHistory: z.string().optional(),
  insuranceProvider: z.string().optional(),
  policyNumber: z.string().optional(),
})


export interface DoctorDetails {
  id: string;
  fullName: string;
}

const PatientDetail = () => {
  const [doctors, setDoctors] = useState<DoctorDetails[]>([])

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('')
  const [phoneNumber, setPatientPhone] = useState<string | undefined>('');
  const [value, setValue] = useState<Dayjs | null>(dayjs(''));
  const [gender, setGender] = useState('')
  const [address, setAddress] = useState('')
  const [emergencyContactNumber, setEmergencyContactNumber] = useState<string | undefined>('');
  const [emergencyContactName, setEmergencyContactName] = useState('')
  const [primaryPhysician,setPhysician] = useState('')
  const [allergies, setAllergies] = useState('');
  const [currentMedications, setCurrentMedications] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('')
  const [familyMedicalHistory, setFamilyMedicalHistory] = useState('')
  const [insuranceProvider, setInsuranceProvider] = useState('');
  const [policyNumber, setPolicyNumber] = useState('')

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info'
  });

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate()

  const handleGenderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGender((event.target as HTMLInputElement).value);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhysician(event.target.value);
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/patient/get-patient`,{
          withCredentials: true
        })

        setFullName(response.data.fullName)
        setEmail(response.data.email)
        setPatientPhone(response.data.phoneNumber)
        setDoctors(response.data.doctors)

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

  async function onSubmit() {
    try {
      const parseData = schema.safeParse({
        fullName,
        email,
        phoneNumber,
        dob: value?.format('MMMM D, YYYY') || '',
        gender,
        address,
        emergencyContactName,
        emergencyContactNumber,
        allergies,
        currentMedications,
        medicalHistory,
        familyMedicalHistory,
        insuranceProvider,
        policyNumber
      })

      if(!parseData.success){
        parseData.error.errors.forEach((error) => {
          console.log(error.message)
          showSnackbar(`${error.message}`, "error");
        });
        return;
      } 
      
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_API}/patient/registerPatient`, {
        fullName,
        email,
        phoneNumber,
        dob: value?.format('MMMM D, YYYY'),
        gender: gender.toUpperCase(),
        address,
        emergencyContactName,
        emergencyContactNumber,
        allergies,
        currentMedications,
        medicalHistory,
        familyMedicalHistory,
        insuranceProvider,
        policyNumber
      } , {
        withCredentials: true
      })

      showSnackbar(`${response.data.message}`, 'success');
      navigate('/Appointment')

    } catch (error) {
      // showSnackbar("Error in Posting Patient Details", "error");
      // console.error('Error in Posting Patient Details')
      if (axios.isAxiosError(error)) {
        console.error('Backend error:', error.response?.data);
        showSnackbar(`${error.response?.data}`, "error");
      } else {
        console.error('Unexpected error:', error);
      }
    }
  }

  return (
    <Card 
      sx={{
        width: { xs: '95%', md: '90%' },
        mx: 'auto',
        my: 3,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        borderRadius: '12px',
        boxShadow: 3,
      }}
    >
      {/* Main Content */}
      <Box sx={{ 
        flex: 1, 
        p: { xs: 2, md: 6 },
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ 
            fontWeight: 'bold', 
            color: 'primary.dark',
            fontSize: { xs: '2rem', md: '3rem' }
          }}>
            WeCare
          </Typography>
          <Typography variant="h6" sx={{ color: 'primary.main' }}>
            Patient Details
          </Typography>
        </Box>

        {/* Personal Information */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Typography variant="h4" sx={{ 
            fontFamily: 'cursive', 
            color: 'text.primary',
            fontSize: { xs: '1.5rem', md: '2rem' }
          }}>
            Personal Information
          </Typography>

          <TextField
            fullWidth
            label="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            gap: 3 
          }}>
            <TextField
              fullWidth
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              fullWidth
              label="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPatientPhone(e.target.value)}
            />
          </Box>

          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            gap: 3 
          }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date of Birth"
                value={value}
                onChange={(newValue) => setValue(newValue)}
                sx={{ width: '100%' }}
              />
            </LocalizationProvider>

            <FormControl fullWidth>
              <Typography>
                Gender
              </Typography>
              <RadioGroup
                value={gender}
                onChange={handleGenderChange}
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'row' , 
                  justifyContent: 'space-around',
                  gap: 2
                }}
              >
                {['FEMALE', 'MALE', 'OTHER'].map((option) => (
                  <FormControlLabel
                    key={option}
                    value={option}
                    control={<Radio />}
                    label={option.charAt(0) + option.slice(1).toLowerCase()}
                    sx={{ 
                      m: 0,
                      '& .MuiFormControlLabel-label': { 
                        fontSize: { xs: '0.8rem', md: '1rem' } 
                      }
                    }}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Box>

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            gap: 3 
          }}>
            <TextField
              fullWidth
              label="Emergency Contact Name"
              value={emergencyContactName}
              onChange={(e) => setEmergencyContactName(e.target.value)}
            />
            <TextField
              fullWidth
              label="Emergency Phone Number"
              value={emergencyContactNumber}
              onChange={(e) => setEmergencyContactNumber(e.target.value)}
            />
          </Box>
        </Box>

        {/* Medical Information */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3, mt: 4 }}>
          <Typography variant="h4" sx={{ 
            fontFamily: 'cursive', 
            color: 'text.primary',
            fontSize: { xs: '1.5rem', md: '2rem' }
          }}>
            Medical Information
          </Typography>

          <TextField
            select
            fullWidth
            label="Select Physician"
            value={primaryPhysician}
            onChange={handleChange}
            helperText="Please select your Physician"
          >
            {doctors.map((doctor) => (
              <MenuItem key={doctor.id} value={doctor.id}>
                {doctor.fullName}
              </MenuItem>
            ))}
          </TextField>

          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            gap: 3 
          }}>
            <TextField
              fullWidth
              label="Policy Number"
              value={policyNumber}
              onChange={(e) => setPolicyNumber(e.target.value)}
            />
            <TextField
              fullWidth
              label="Insurance Provider"
              value={insuranceProvider}
              onChange={(e) => setInsuranceProvider(e.target.value)}
            />
          </Box>

          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            gap: 3 
          }}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Allergies (if any)"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Current Medications"
              value={currentMedications}
              onChange={(e) => setCurrentMedications(e.target.value)}
            />
          </Box>

          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            gap: 3 
          }}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Medical History"
              value={medicalHistory}
              onChange={(e) => setMedicalHistory(e.target.value)}
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Family Medical History"
              value={familyMedicalHistory}
              onChange={(e) => setFamilyMedicalHistory(e.target.value)}
            />
          </Box>
        </Box>

        {/* Upload Section */}
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <Button
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
            sx={{
              width: { xs: '100%', md: 250 },
              height: { xs: 80, md: 100 },
              background: 'linear-gradient(135deg, #27ae60 30%, #2ecc71 90%)',
              borderRadius: '12px',
              '&:hover': {
                background: 'linear-gradient(135deg, #2ecc71 30%, #27ae60 90%)',
              },
            }}
          >
            Upload Report
            <br />
            (if any)
          </Button>
        </Box>

        {/* Submit Button */}
        <Button
          fullWidth
          variant="contained"
          onClick={onSubmit}
          sx={{
            py: 2,
            background: 'linear-gradient(135deg, #2980b9 30%, #3498db 90%)',
            borderRadius: '50px',
            fontSize: { xs: '1rem', md: '1.1rem' },
            '&:hover': {
              background: 'linear-gradient(135deg, #3498db 30%, #2980b9 90%)',
            },
          }}
        >
          Continue
        </Button>
      </Box>

      {/* Image Section */}
      {!isMobile && (
        <Box sx={{ 
          width: '30%', 
          minHeight: '100%',
          display: { xs: 'none', md: 'block' }
        }}>
          <Box
            component="img"
            src={image}
            alt="Doctor"
            sx={{
              height: '100%',
              width: '100%',
              objectFit: 'cover',
              borderTopRightRadius: '12px',
              borderBottomRightRadius: '12px'
            }}
          />
        </Box>
      )}

      <AlertSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        position={{ vertical: 'bottom', horizontal: 'right' }}
      />
    </Card>
  );
};

export default PatientDetail;


