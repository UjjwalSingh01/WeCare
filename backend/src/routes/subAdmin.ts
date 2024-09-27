// 1. Doctor details
// 2. Update schedule -> completed | cancelled
// 3. get-doctor appointments


import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { PrismaClient, Status } from "@prisma/client";
import dayjs from "dayjs";
import { z } from 'zod'
// import { sendOtpEmail } from "../middlewares/nodemailer";

const prisma = new PrismaClient();

const app = express();
app.use(express.json());
app.use(cookieParser());

const router = express.Router();

// interface SubAdminDetail {
//     email: string,
//     pin: string
// }

// router.post('/subadmin-login', async(req, res) => {
//     try {
//         const detail: SubAdminDetail = await req.body;

//         const response = await prisma.subAdmin.findFirst({
//             where:{
//                 email: detail.email
//             }
//         })

//         if(!response){
//             return res.status(401).json({
//                 error: 'Sub-Admin Does Not Exists'
//             })
//         }

//         if(response.pin != detail.pin){
//             return res.status(401).json({
//                 error: 'Invalid Pin'
//             })
//         }

//         res.cookie('subAdmin', response.id , {
//             httpOnly: true,
//             secure: false,
//             maxAge: 12 * 60 * 1000,
//             sameSite: 'lax'
//         })

//         return res.json({
//             message: 'Login Successful'
//         })

//     } catch (error) {
//         console.error("Error Logging in Sub Admin", error);
//         return res.status(500).json({ 
//             error: "Error in Logging in Sub Admin" 
//         });
//     }
// })

router.get('/subAdmin-dashbaord', async(req, res) => {
    try {
        const subAdminId: string = req.cookies.subAdmin

        if (!subAdminId) {
            return res.status(401).json({ 
                error: "Unauthorized: No token provided." 
            });
        }

        const name = await prisma.subAdmin.findFirst({
            where:{
                id: subAdminId
            },
            select:{
                fullname: true
            }
        })

        if(!name){
            return res.status(401).json({ 
                error: "Sub Admin does Not Exist" 
            });
        }

        const subAdmin = await prisma.subAdmin.findUnique({
            where: {
              id: subAdminId,
            },
            select: {
              doctors: true,
            },
          });
      
          if (!subAdmin) {
            throw new Error("SubAdmin not found");
          }
      
          const doctorIds = subAdmin.doctors;
      
          const appointments = await prisma.appointment.findMany({
            where: {
              doctorId: {
                in: doctorIds,
              },
            },
            select: {
              id: true,
              reason: true,
              date: true,
              time: true,
              status: true,
              patient: {
                select: {
                  fullname: true,
                },
              },
              doctor: {
                select: {
                  fullname: true,
                },
              },
            },
          });
      
          const formattedAppointments = appointments.map((appointment) => ({
            appointmentId: appointment.id,
            patientName: appointment.patient.fullname,
            doctor: appointment.doctor.fullname,
            date: appointment.date,
            time: appointment.time,
            status: appointment.status,
            reason: appointment.reason,
          }));

        const now = dayjs();
  
        // Get start and end dates of the current month (formatted as 'YYYY-MM-DD')
        const startOfCurrentMonth = now.startOf('month').format('MMMM D, YYYY');
        const endOfCurrentMonth = now.endOf('month').format('MMMM D, YYYY');

        // Get start and end dates of the last month (formatted as 'YYYY-MM-DD')
        const startOfLastMonth = now.subtract(1, 'month').startOf('month').format('MMMM D, YYYY');
        const endOfLastMonth = now.subtract(1, 'month').endOf('month').format('MMMM D, YYYY');
        
        // Count appointments in the current month
        const currentMonthAppointments = await prisma.appointment.count({
            where: {
                date: {
                    gte: startOfCurrentMonth,
                    lte: endOfCurrentMonth,
                },
            },
        });

        // Count appointments in the last month
        const lastMonthAppointments = await prisma.appointment.count({
            where: {
            date: {
                gte: startOfLastMonth,
                lte: endOfLastMonth,
            },
            },
        });
              
        const totalAppointments = await prisma.appointment.count({
            where: {
                doctorId: {
                    in: doctorIds,
                },
            },
        });

        return res.json({
            name: name.fullname,
            appointments: formattedAppointments,
            monthly: { currentMonthAppointments, lastMonthAppointments },
            totalAppointments: totalAppointments
        })

    } catch (error) {
        console.error("Error in Sub Admin Dashboard Details", error);
        return res.status(500).json({ 
            error: "Error in Sub Admin Dashboard Details" 
        });
    }
})


const SubAdminUpdateSchema = z.object({
    fullname: z.string().min(2, 'Name Must Contain Atleast 2 Characters'),
    email: z.string().email('Enter Correct Email Format'),
    pin: z.string().length(6, 'Pin must be exactly 6 digits').regex(/^\d{6}$/, 'Pin must only contain digits'),
})

type SubAdminUpdateTYpe = z.infer<typeof SubAdminUpdateSchema>

router.post('/update-profile', async(req, res) => {
    const detail: SubAdminUpdateTYpe = await req.body

    try {
        const subAdminId: string = req.cookies.subAdmin

        if (!subAdminId) {
            return res.status(401).json({ 
                error: "Unauthorized: No token provided." 
            });
        }

        const zodResult = await SubAdminUpdateSchema.safeParse(detail)
        if(!zodResult.success){
            return res.status(401).json({
                error: 'Invalid Credentials'
            })
        }

        await prisma.subAdmin.update({
            where: {
                id: subAdminId
            },
            data:{
                fullname: detail.fullname,
                email: detail.email,
                pin: detail.pin
            }
        })

        return res.json({
            message: 'Updated Successfully'
        })

    } catch (error) {
        console.error("Error in Sub Admin Updation", error);
        return res.status(500).json({ 
            error: "Error in Sub Admin Updation" 
        });
    }
})


router.post('/update', async(req, res) => {
    const appointmentsToUpdate: { id: string, status: Status }[] = await req.body;

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