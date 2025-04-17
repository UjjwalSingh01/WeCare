import express from 'express';
import cors from 'cors';
import { patientRoute } from './routes/patient';
import { appointmentRoute } from './routes/appointment';
import { adminRoute } from './routes/admin';
import cookieParser from 'cookie-parser';
import { doctortRoute } from './routes/doctor';
import { subAdminRouter } from './routes/subAdmin';
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/patient', patientRoute)
app.use('/api/v1/appointment', appointmentRoute)
app.use('/api/v1/admin', adminRoute)
app.use('/api/v1/doctor', doctortRoute)
app.use('/api/v1/subAdmin', subAdminRouter)

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

// module.exports.handler = ServerlessHttp(app);