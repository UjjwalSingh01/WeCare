import { useState } from 'react';
// import { useForm, Controller } from 'react-hook-form';
// import { z } from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';
import { Card, TextField, Button, Typography, FormControl, RadioGroup, FormControlLabel, Radio, MenuItem } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import PhoneInput from 'react-phone-number-input';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import image from '../assets/doctor.jpg'

const currencies = [
  {
    value: 'USD',
    label: '$',
  },
  // ... other currencies
];

// Define Zod schema for form validation
// const schema = z.object({
//   fullName: z.string().min(2, 'Full Name must be at least 2 characters long'),
//   email: z.string().email('Invalid email address'),
//   phone: z.string().min(10, 'Phone number must be at least 10 characters long'),
//   dob: z.date().nonempty('Date of Birth is required'),
//   gender: z.string().nonempty('Gender is required'),
//   address: z.string().optional(),
//   allergies: z.string().optional(),
//   medications: z.string().optional(),
//   medicalHistory: z.string().optional(),
//   familyMedicalHistory: z.string().optional(),
//   physician: z.string().optional(),
// });

const PatientDetail = () => {
  const [value, setValue] = useState<Dayjs | null>(dayjs('2024-04-17'));
  const [patientPhone, setPatientPhone] = useState('');
  const [emergenyPhone, setEmergenyPhone] = useState('');

  return (
    <Card 
        sx={{
            width: { xs: '95%', md: '90%' }, // Adjusts to 95% on smaller screens and 90% on larger screens
            mx: 'auto', // Centers the card horizontally
            my: 3, // Adds vertical margin
            overflowY: 'auto',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
            // py: 1,
            transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Smooth transition for hover effect
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', // Default shadow
            '&:hover': {
                transform: 'translateY(-10px)', // Moves the card up by 10px
                boxShadow: '0px 10px 24px rgba(0, 0, 0, 0.2)', // Increases shadow on hover
            },
            backgroundColor: 'background.paper', // Uses theme background color
            borderRadius: '12px', // Smooth border
        }}
    >
  <div className="h-screen flex">
    {/* Form Section */}
    <div className="w-full md:w-[80%] flex-col justify-center items-center py-10  md:px-24">
      {/* Header */}
      <section className="flex-col p-3 mb-8">
        <Typography variant="h3" align="left" sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
          WeCare
        </Typography>
        <Typography variant="h6" align="left" sx={{ color: 'primary.main' }}>
          Patient Details
        </Typography>
      </section>

      {/* Personal Information */}
      <section className="flex-col gap-6">
        <Typography align="left" variant="h4" sx={{ fontFamily: 'cursive', color: 'text.primary', mb: 4 }}>
          Personal Information
        </Typography>
        <div className="flex-col gap-4">
          {/* Full Name */}
          <TextField
            id="outlined-basic"
            label="Full Name"
            variant="outlined"
            fullWidth
            sx={{ mb: 3 }}
          />

          {/* Email and Phone */}
          <div className="flex flex-col md:flex-row gap-4">
            <TextField
              id="outlined-basic"
              label="Email"
              variant="outlined"
              sx={{ width: '100%' }}
            />
            <PhoneInput
              placeholder="Enter phone number"
              value={patientPhone}
              onChange={setPatientPhone}
              defaultCountry="IN"
              style={{
                border: '2px solid lightgrey',
                borderRadius: '8px',
                padding: '10px',
                width: '100%',
              }}
            />
          </div>

          {/* Date of Birth and Gender */}
          <div className="flex flex-col md:flex-row gap-4 mt-5">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date of Birth"
                value={value}
                onChange={(newValue) => setValue(newValue)}
                sx={{ width: '100%' }}
              />
            </LocalizationProvider>
            <FormControl sx={{ width: '100%' }}>
              <RadioGroup
                row
                name="gender"
                sx={{ justifyContent: 'space-around' }}
              >
                <FormControlLabel 
                  sx={{ border: '2px dotted lightgrey', pr: 0.5 }} 
                  value="female" control={<Radio />} label="Female" 
                />
                <FormControlLabel 
                  sx={{ border: '2px dotted lightgrey', pr: 0.5 }} 
                  value="male" control={<Radio />} label="Male" 
                />
                <FormControlLabel 
                  sx={{ border: '2px dotted lightgrey', pr: 0.5 }} 
                  value="other" control={<Radio />} label="Other" 
                />
              </RadioGroup>
            </FormControl>
          </div>

          {/* Address */}
          <TextField
            id="outlined-multiline-static"
            label="Address"
            multiline
            rows={4}
            fullWidth
            sx={{ mt: 5 }}
          />

          {/* Emergency Contact */}
          <div className="flex flex-col md:flex-row gap-4 mt-5">
            <TextField
              id="outlined-basic"
              label="Emergency Contact Name"
              variant="outlined"
              sx={{ width: '100%' }}
            />
            <PhoneInput
              placeholder="Enter phone number"
              value={emergenyPhone}
              onChange={setEmergenyPhone}
              defaultCountry="IN"
              style={{
                border: '2px solid lightgrey',
                borderRadius: '8px',
                padding: '10px',
                width: '100%',
              }}
            />
          </div>
        </div>
      </section>

      {/* Medical Information */}
      <section className="my-8  mt-10">
        <Typography align="left" variant="h4" sx={{ fontFamily: 'cursive', color: 'text.primary', mb: 2 }}>
          Medical Information
        </Typography>
        <div className="flex-col gap-6">
          <TextField
            id="outlined-select-currency"
            select
            label="Select Physician"
            fullWidth
            helperText="Please select your Physician"
            sx={{ mb: 3 }}
          >
            {currencies.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <div className="flex flex-col md:flex-row gap-4">
            <TextField
              label="Allergies (if any)"
              multiline
              rows={4}
              sx={{ width: '100%' }}
            />
            <TextField
              label="Current Medications"
              multiline
              rows={4}
              sx={{ width: '100%' }}
            />
          </div>

          <div className="flex flex-col md:flex-row gap-4 mt-5">
            <TextField
              label="Medical History"
              multiline
              rows={4}
              sx={{ width: '100%' }}
            />
            <TextField
              label="Family Medical History (if relevant)"
              multiline
              rows={4}
              sx={{ width: '100%' }}
            />
          </div>
        </div>
      </section>

      {/* Upload Report */}
      <section className="my-7">
        <Button
          component="label"
          variant="contained"
          startIcon={<CloudUploadIcon />}
          sx={{
            width: 250,
            height: 100,
            background: 'linear-gradient(135deg, #27ae60 30%, #2ecc71 90%)',
            color: 'white',
            fontWeight: 'bold',
            borderRadius: '12px',
            boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.2)',
            '&:hover': {
              background: 'linear-gradient(135deg, #2ecc71 30%, #27ae60 90%)',
            },
          }}
        >
          Upload Report
          <br />
          (if any)
          {/* <VisuallyHiddenInput
            type="file"
            onChange={(event) => console.log(event.target.files)}
            multiple
          /> */}
        </Button>
      </section>

      {/* Continue Button */}
      <section>
        <Button
          variant="contained"
          fullWidth
          sx={{
            background: 'linear-gradient(135deg, #2980b9 30%, #3498db 90%)',
            color: 'white',
            padding: '12px 20px',
            fontWeight: 'bold',
            borderRadius: '50px',
            mb:2,
            boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.2)',
            '&:hover': {
              background: 'linear-gradient(135deg, #3498db 30%, #2980b9 90%)',
            },
          }}
        >
          Continue
        </Button>
      </section>
    </div>

    {/* Image Section */}
    <div className="hidden md:block w-[30%]">
      <img src={image} alt="Doctor" className="h-full object-cover rounded-l-lg shadow-lg" />
    </div>
  </div>
</Card>

  );
};

export default PatientDetail;


