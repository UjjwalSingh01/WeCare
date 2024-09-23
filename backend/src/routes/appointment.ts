import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { PrismaClient } from "@prisma/client";
import { appointmentSchema, appointmentType } from "../schema";
// import { sendOtpEmail } from "../middlewares/nodemailer";

const prisma = new PrismaClient();

const app = express();
app.use(express.json());
app.use(cookieParser());

const JWT_SECRET = process.env.JWT_SECRET as string;

// CHECK 1: A PATIENT CANNOT HAVE 5 ACTIVE APPOINTMENTS
// CHECK 2: A PATIENT CANNOT MAKE APPOINTMENT AFTER 6 MONTHS

const router = express.Router();

router.post('/get-appointment', async(req, res) => {
    try {
        const patientId = await req.cookies.Patient

        const appointments = await prisma.appointment.findMany({
            where: {
              patientId: patientId,
              status: 'ACTIVE',
            },
            select: {
              id: true,
              date: true,
              time: true,
              doctor: {
                select: {
                  fullname: true,
                },
              },
            },
        });
          
        const result = appointments.map(appointment => ({
            appointmentId: appointment.id,
            date: appointment.date,
            time: appointment.time,
            doctorName: appointment.doctor.fullname,
        }));

        const doctors = await prisma.doctor.findMany({
            select: {
                fullname: true,
                id: true
            }
        })

        return res.status(200).json({
            appointments: result,
            doctors: doctors
        })


    } catch (error) {
        console.error("Error in Retrieving Appointments", error);
        return res.status(500).json({ 
            error: "Error in Retrieving Appointments" 
        });
    }
})

router.post('/make-appointment', async(req, res) => {
    try {
        const detail: appointmentType = await req.body
        const zodResult = await appointmentSchema.safeParse(detail)
        if(!zodResult.success){
            return res.status(401).json({
                error: 'Invalid Credentials'
            })
        }

        const patientId = await req.cookies.patient

        if(!patientId){
            return res.status(401).json({
                error: "Unauthorized: Patient token not present",
            });
        }

        const response = await prisma.appointment.count({
            where:{
                patientId: patientId,
                status: 'ACTIVE'
            }
        })

        if(response == 5){
            return res.status(400).json({
                error: "You cannot have more than 5 appointments",
            });
        }

        const duplicateAppointment = await prisma.appointment.findFirst({
            where:{
                doctorId: detail.physician,
                date: detail.date,
                time: detail.time
            }
        })

        if(duplicateAppointment){
            return res.status(409).json({
                error: "Appointment is Not Available at this date and time",
            });
        }

        const duplicatePatientAppointment = await prisma.appointment.findFirst({
            where:{
                patientId: patientId,
                date: detail.date,
                time: detail.time
            }
        })

        if(duplicatePatientAppointment){
            return res.status(409).json({
                error: "You Already have an Appointment at this Date & Time",
            });
        }

        await prisma.appointment.create({
            data: {
                doctorId: detail.physician,
                patientId: patientId,
                reason: detail.reason,
                note: detail.note,
                date: detail.date,
                time: detail.time,
                status: 'ACTIVE'
            }
        })

        return res.status(200).json({
            message: 'Appointment Added Successfully'
        })

    } catch (error) {
        console.error('Error creating appointment:', error);
        return res.status(500).json({
            error: "Internal Server Error: Unable to create appointment",
        });
    }
})

router.post('/cancel-appointment', async(req, res) => {
    try {
        const appointmentId: string = await req.body

        const appointment = await prisma.appointment.findFirst({
            where:{
                id: appointmentId
            }
        })

        if(!appointment){
            return res.status(200).json({
                error: "Appointment Not Present"
            })
        }

        await prisma.appointment.update({
            where:{
                id: appointmentId,
            },
            data:{
                status: 'CANCELLED'
            }
        })

        return res.status(200).json({
            message: 'Appointment Cancelled Successfully'
        })

    } catch (error) {
        console.error("Error in Cancelling Appointments", error);
        return res.status(500).json({ 
            error: "Error in Cancelling Appointments" 
        });
    }
})

// appointment ids ayengi completed or cancelled from the manager of the doctor
router.post('/update-appointment', async(req, res) => {
    
})

export const appointmentRoute = router;
