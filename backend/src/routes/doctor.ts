import express from "express";
import cookieParser from "cookie-parser";
import { PrismaClient } from "@prisma/client";
// import { sendOtpEmail } from "../middlewares/nodemailer";

const prisma = new PrismaClient();

const app = express();
app.use(express.json());
app.use(cookieParser());

const JWT_SECRET = process.env.JWT_SECRET as string;

// CHECK 1: A PATIENT CANNOT HAVE 5 ACTIVE APPOINTMENTS
// CHECK 2: A PATIENT CANNOT MAKE APPOINTMENT AFTER 6 MONTHS

const router = express.Router();

router.get('/get-doctor', async(req, res) => {
    try {
        const doctors = await prisma.doctor.findMany()

        return res.json({
            doctor: doctors
        })

    } catch (error) {
        console.error("Error Retrieving ALL Doctors Details:", error);
        return res.status(401).json({ 
            error: "Error Retrieving ALL Doctors Details" 
        });
    }
})

router.get('/get-doctor/:email', async(req, res) => {
    try {
        const DoctorEmail: string = await req.params.email

        const response = await prisma.doctor.findFirst({
            where:{
                email: DoctorEmail
            }, 
            select:{
                id: false
            }
        })

        if(!response){
            return res.json({
                error: 'Doctor Does Not Exists'
            })
        }

        return res.json({
            doctor: response
        })
        
    } catch (error) {
        console.error("Error Retrieving Doctor Details:", error);
        return res.status(401).json({ 
            error: "Error Retrieving Doctor Details" 
        });
    }
})


export const doctortRoute = router;
