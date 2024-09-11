// 1. Doctor details
// 2. Update schedule -> completed | cancelled
// 3. get-doctor appointments


import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { PrismaClient, Status } from "@prisma/client";
// import { sendOtpEmail } from "../middlewares/nodemailer";

const prisma = new PrismaClient();

const app = express();
app.use(express.json());
app.use(cookieParser());

const router = express.Router();

interface SubAdminDetail {
    email: string,
    pin: string
}

router.post('/subadmin', async(req, res) => {
    try {
        const detail: SubAdminDetail = await req.body;

        const response = await prisma.subAdmin.findFirst({
            where:{
                email: detail.email
            }
        })

        if(!response){
            return res.status(401).json({
                error: 'Sub-Admin Does Not Exists'
            })
        }

        if(response.id != detail.pin){
            return res.status(401).json({
                error: 'Invalid Pin'
            })
        }

        res.cookie('subAdmin', response.id , {
            httpOnly: true,
            secure: false,
            maxAge: 12 * 60 * 1000,
            sameSite: 'lax'
        })

        return res.json({
            message: 'Login Successful'
        })

    } catch (error) {
        console.error("Error Logging in Sub Admin", error);
        return res.status(500).json({ 
            error: "Error in Logging in Sub Admin" 
        });
    }
})

router.get('/dashbaord', async(req, res) => {
    try {
        const subAdminId: string = req.cookies.subAdmin

        if (!subAdminId) {
            return res.status(401).json({ 
                error: "Unauthorized: No token provided." 
            });
        }

        const appointments = await prisma.appointment.findMany({
            where: {
              doctorId: subAdminId
            },
            include: {
              patient: true,  
            }
        });
          
        const appointmentDetails = appointments.map((appointment) => ({
            patientName: appointment.patient.fullname,
            reason: appointment.reason,
            note: appointment.note,
            date: appointment.date,
            time: appointment.time,
            status: appointment.status
        }));
          

        return res.json({
            appointments: appointments
        })

    } catch (error) {
        console.error("Error in Sub Admin Dashboard Details", error);
        return res.status(500).json({ 
            error: "Error in Sub Admin Dashboard Details" 
        });
    }
})


router.post('/update', async(req, res) => {
    const appointmentsToUpdate: { id: string, status: Status }[] = req.body;

    try {
        await Promise.all(
            appointmentsToUpdate.map(async (appointment) => {
                await prisma.appointment.update({
                    where: {
                        id: appointment.id, 
                    },
                    data: {
                        status: appointment.status, 
                    },
                });
            })
        );

        return res.json({ 
            message: "Appointments updated successfully" 
        });
        
    } catch (error) {
        console.error("Error in Sub Admin in Updating Appointment", error);
        return res.status(500).json({ 
            error: "Error in Sub Admin in Updating Appointment" 
        });
    }
})

router.post('/logout', async(req, res) => {
    try {
        res.clearCookie('subAdmin')

        return res.json({
            message: 'Logout Successful'
        })

    } catch (error) {
        console.error("Error in Sub Admin Logout", error);
        return res.status(500).json({ 
            error: "Error in Sub Admin Logout" 
        });
    }
})


export const subAdminRouter = router;