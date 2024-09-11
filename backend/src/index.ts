import express from 'express';
import cors from 'cors';
import { patientRoute } from './routes/patient';
import { appointmentRoute } from './routes/appointment';
import { adminRoute } from './routes/admin';

const app=express();
const PORT= process.env.PORT || 3000;

app.use(cors());
app.use('/api/v1/patient', patientRoute)
app.use('/api/v1/appointment', appointmentRoute)
app.use('/api/v1/admin', adminRoute)

app.listen(PORT);