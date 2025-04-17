import { Button, TextField, Typography } from "@mui/material";
import image from '../assets/doctor.jpg';
import 'react-phone-number-input/style.css';
import { useState } from "react";
import PinModal from "../components/AdminLoginModal";
import { z } from 'zod'
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AlertSnackbar } from "../components/AlertSnackbar";

const registerSchema = z.object({
  email: z.string().email('Enter Correct Email Format'),
  fullName: z.string().min(2, 'Name Must Contain Atleast 2 Characters'),
  phoneNumber :z.string().length(10, 'Phone Number Must Contain Only 10 digits')
  // phoneNumber :z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),
})

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('')

  const navigate = useNavigate()

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info'
  });

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  async function onSubmit() {
    try {
      const parseData = registerSchema.safeParse({ fullName, email, phoneNumber })
      if(!parseData.success){
        parseData.error.errors.forEach((error) => {
          console.log(error.message)
          showSnackbar(`${error.message}`, "error");
        });
      }

      const response = await axios.post(`${import.meta.env.VITE_BACKEND_API}/patient/register`, {
        fullName,
        email,
        phoneNumber
      }, {
        withCredentials: true
      })

      showSnackbar(`${response.data.message}`, "success");
      navigate('/PatientDetails');

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
      <div className="bg-white/80 md:w-[80%] h-[90%] flex shadow-2xl rounded-xl overflow-hidden">
        <section className="bg-white m-5 w-full md:w-3/5 xl:w-2/5 flex flex-col justify-center md:p-10 rounded-br-[200px]">
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
              onChange={(e) => {setFullName(e.target.value)}}
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

            <TextField
              id="standard-basic"
              label="Phone Number"
              variant="standard"
              fullWidth
              onChange={(e) => {setPhoneNumber(e.target.value)}}
              sx={{
                input: { padding: '8px 12px', borderRadius: '5px', },
                mb: 2,
              }}
            />

            {/* <PhoneInput
              placeholder="Enter phone number"
              value={phoneNumber}
              onChange={setPhoneNumber}
              defaultCountry="IN"
            //   className="mb-4 p-2 border rounded-md border-gray-300"
              style={{ marginTop:45, marginBottom:40, padding: '8px 12px', borderRadius: '5px', border: '1px solid #ccc', width: '100%' }}
            /> */}

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

        <section className="hidden md:block md:w-2/5 xl:w-3/5">
          <img
            src={image}
            alt="Doctor"
            className="h-full w-full object-cover rounded-tl-[400px]"
          />
        </section>
      </div>
      <AlertSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        position={{ vertical: 'bottom', horizontal: 'right' }}
      />
    </div>
  );
};

export default Register;
