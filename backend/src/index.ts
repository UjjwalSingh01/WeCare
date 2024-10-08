import express from 'express';
import cors from 'cors';
import { patientRoute } from './routes/patient';
import { appointmentRoute } from './routes/appointment';
import { adminRoute } from './routes/admin';
import cookieParser from 'cookie-parser';
import { doctortRoute } from './routes/doctor';
import { subAdminRouter } from './routes/subAdmin';

const app = express();
const PORT = process.env.PORT || 3000;

// app.use(cors());
app.use(cors({
    origin: 'http://localhost:5173', // Your frontend URL
    credentials: true, // Allow credentials (cookies, headers)
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/patient', patientRoute)
app.use('/api/v1/appointment', appointmentRoute)
app.use('/api/v1/admin', adminRoute)
app.use('/api/v1/doctor', doctortRoute)
app.use('/api/v1/subAdmin', subAdminRouter)

app.listen(PORT);