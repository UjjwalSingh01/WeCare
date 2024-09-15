import { Alert, Button, Snackbar, TextField, Typography } from "@mui/material";
import image from '../assets/doctor.jpg';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
// import  E164Number  from 'react-phone-number-input';
import { useState } from "react";
import PinModal from "../components/PinModal";
import { z } from 'zod'
import axios from "axios";
import { useNavigate } from "react-router-dom";

const registerSchema = z.object({
  fullname: z.string().min(2, 'Full Name Must Contain Atleast 2 Characters'),
  email: z.string().email('Email Format is Invalid'),
  phoneNumber :z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),
})

const Register = () => {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  // const [phoneNumber, setPhoneNumber] = useState<typeof E164Number | undefined>(undefined);
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>('')

  const navigate = useNavigate()

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  async function onSubmit() {
    try {
      const parseData = await registerSchema.safeParse({ fullname, email, phoneNumber })
      if(!parseData.success){
        parseData.error.errors.forEach((error) => {
          console.log(error.message)
          showSnackbar(`${error.message}`, "error");
        });
      }
      else {
        const response = await axios.post('http://localhost:3000/api/v1/patient/register', {
          fullname,
          email,
          phoneNumber
        })

        if (response.status === 200) {
          showSnackbar("Registration Successful", "success");
          navigate('/PatientDetails');
        } else {
          showSnackbar("Registration Failed", "error");
        }
      }

    } catch(error) {
      showSnackbar("Error in Registration", "error");
      console.error('Error in Registration: ', error)
    }
  }

  return (
    <div
      className="w-screen h-screen p-5 flex justify-center items-center"
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backdropFilter: 'blur(30px)',
      }}
    >
      <div className="bg-white/80 w-[80%] h-[90%] flex shadow-2xl rounded-xl overflow-hidden">
        <section className="bg-white/90 m-5 w-2/5 flex flex-col justify-center p-10 rounded-br-[200px]">
          <div className="mx-8">
            <Typography variant="h3" gutterBottom align="left" className="text-blue-700 font-extrabold">
              WeCare
            </Typography>
            <Typography variant="h6" gutterBottom align="left" className="text-gray-600">
              Book Your Appointments .....
            </Typography>
          </div>

          <div className="flex flex-col justify-center space-y-6 m-10">
            
            <TextField
                id="input-with-sx"
                label="Full name"
                variant="standard"
                fullWidth
                onChange={(e) => {setFullname(e.target.value)}}
                sx={{ 
                    input: { 
                        padding: '8px 12px', 
                        borderRadius: '5px', 
                    } 
                }}
            />

            <TextField
              id="standard-basic"
              label="Email"
              variant="standard"
              fullWidth
              onChange={(e) => {setEmail(e.target.value)}}
              sx={{
                input: { padding: '8px 12px', borderRadius: '5px', },
                mb: 2,
              }}
            />

            <PhoneInput
              placeholder="Enter phone number"
              value={phoneNumber}
              onChange={setPhoneNumber}
              defaultCountry="IN"
            //   className="mb-4 p-2 border rounded-md border-gray-300"
              style={{ marginTop:45, marginBottom:40, padding: '8px 12px', borderRadius: '5px', border: '1px solid #ccc', width: '100%' }}
            />

            <Button
              variant="contained"
              fullWidth
              onClick={() => {onSubmit()}}
              sx={{
                background: 'linear-gradient(135deg, #6DD5FA 30%, #2980B9 90%)',
                color: 'white',
                padding: '12px 20px',
                fontWeight: 'bold',
                borderRadius: '50px',
                boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.2)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #2980B9 30%, #6DD5FA 90%)',
                },
              }}
            >
              Get Started
            </Button>
          </div>
          <div>
            <PinModal />
          </div>
        </section>

        <section className="w-3/5">
          <img
            src={image}
            alt="Doctor"
            className="h-full w-full object-cover rounded-tl-[400px]"
          />
        </section>
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

export default Register;
