import express from "express";
import cookieParser from "cookie-parser";
import { PrismaClient } from "@prisma/client";
import dayjs from 'dayjs'
import { AddAdminSchema, AddAdminType, AddSubAdminSchema, AddSubAdminType, doctorSchema, doctorType } from "../schema";
import { date } from "zod";
// import { sendOtpEmail } from "../middlewares/nodemailer";

const prisma = new PrismaClient();

const app = express();
app.use(express.json());
app.use(cookieParser());

const router = express.Router();

// CHECK 1: PROVIDE FILTERING SYSTEM |||| IN THE FRONTEND ??

interface AdminDetail {
    email: string,
    pin: string
}

router.post('/admin', async(req, res) => {
    try {
        const detail: AdminDetail = await req.body;

        // search admin
        const response = await prisma.admin.findFirst({
            where:{
                email: detail.email
            }
        })

        if(!response){
            return res.status(401).json({
                message: "User Does not Exist"
            })
        }

        if(response.pin != detail.pin){
            return res.status(401).json({
                error: 'Invalid Credential'
            })
        }

        res.cookie("Admin", response.id, {
            httpOnly: true,
            secure: false, 
            maxAge: 12 * 60 * 60 * 1000,
            sameSite: "lax",
        });

        // verfied then navigate to admin page
        return res.status(200).json({
            message: 'Verified'
        })

    } catch (error) {
        console.error("Error in Admin Login:", error);
        return res.status(500).json({ 
            error: "Error in Admin Login" 
        });
    }
})


router.get('/admin-dashboard', async(req, res) => {
    try {
        const AdminId: string = await req.cookies.Admin;

        const name = await prisma.admin.findFirst({
            where: {
                id: AdminId,
            },
            select:{
                removeFacility: true,
                fullname: true
            }
        })

        const doctors = await prisma.doctor.findMany({
            select:{
                fullname: true,
                id: true
            }
        })

        const totalAppointment = await prisma.appointment.count()

        const now = dayjs();
  
        // Get start and end dates of the current month (formatted as 'YYYY-MM-DD')
        const startOfCurrentMonth = now.startOf('month').format('YYYY-MM-DD');
        const endOfCurrentMonth = now.endOf('month').format('YYYY-MM-DD');

        // Get start and end dates of the last month (formatted as 'YYYY-MM-DD')
        const startOfLastMonth = now.subtract(1, 'month').startOf('month').format('YYYY-MM-DD');
        const endOfLastMonth = now.subtract(1, 'month').endOf('month').format('YYYY-MM-DD');
        
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

        const appointment = await prisma.appointment.findMany({
            select:{
                date: true,
                time: true,
                status: true,
                doctor: {
                    select:{
                        fullname: true,
                    }
                },
                patient:{
                    select:{
                        fullname: true
                    }
                }
            }
        })

        const appointments = appointment.map(appointment => ({
            doctor: appointment.doctor.fullname,
            patient: appointment.patient.fullname,
            date: appointment.date,
            time: appointment.time,
            status: appointment.status
        }))

        const subadmin = await prisma.subAdmin.findMany({
            select:{
                id: true,
                fullname: true
            }
        })

        let admins: any = [];
        if(name?.removeFacility === true){
            admins = await prisma.admin.findMany({
                select:{
                    id: true,
                    fullname: true
                }
            })
        }

        return res.json({
            name: name?.fullname,
            doctors: doctors,
            doctorCount: doctors.length,
            subadmins: subadmin,
            admins: admins,
            total: totalAppointment,
            monthly: { currentMonthAppointments, lastMonthAppointments },
            appointments: appointments,
        })
        

    } catch (error) {
        console.error("Error in Admin DashBoard Details:", error);
        return res.status(500).json({ 
            error: "Error in Admin DashBoard Details" 
        });
    }
})


router.post('/add-admin', async(req, res) => {
    try {
        const detail: AddAdminType = await req.body;
        const zodResult = await AddAdminSchema.safeParse(detail)
        if(!zodResult.success){
            return res.status(401).json({
                error: 'InValid Credentials'
            })
        }

        await prisma.admin.create({
            data:{
                fullname: detail.fullname,
                email: detail.email,
                pin: detail.pin,
                removeFacility: false
            }
        })

        return res.status(200).json({
            message: 'Admin Added Successfully'
        })

    } catch (error) {
        console.error("Error in Adding Admin:", error);
        return res.status(500).json({ 
            error: "Error in Adding Admin" 
        });
    }
})

router.post('/remove-admin', async(req, res) => {
    try {
        const adminId = await req.body

        const response = await prisma.admin.findFirst({
            where:{
                id: adminId
            }
        })

        if(!response){
            return res.status(401).json({
                message: "Admin Does not Exist"
            })
        }

        await prisma.admin.delete({
            where:{
                id: adminId
            }
        })

        return res.status(200).json({
            message: 'Admin Deleted Successfully'
        })

    } catch (error) {
        console.error("Error in Removing Admin:", error);
        return res.status(500).json({ 
            error: "Error in Removing Admin" 
        });
    }

})


router.post('/add-subadmin', async(req, res) => {
    try {
        const detail: AddSubAdminType = await req.body;
        const zodResult = await AddSubAdminSchema.safeParse(detail)
        if(!zodResult.success){
            return res.status(401).json({
                error: 'InValid Credentials'
            })
        }

        await prisma.subAdmin.create({
            data:{
                fullname: detail.fullname,
                email: detail.email,
                pin: detail.pin,
            }
        })

        return res.status(200).json({
            message: 'Sub-Admin Added Successfully'
        })

    } catch (error) {
        console.error("Error in Adding Sub-Admin:", error);
        return res.status(500).json({ 
            error: "Error in Adding Sub-Admin" 
        });
    }
})

router.post('/remove-subadmin', async(req, res) => {
    try {
        const SubAdminId: string = await req.body

        const response = await prisma.subAdmin.findFirst({
            where:{
                id: SubAdminId
            }
        })

        if(!response){
            return res.status(401).json({
                error: 'Sub Admin Does Not Exists'
            })
        }

        await prisma.subAdmin.delete({
            where:{
                id: SubAdminId
            }
        })

        return res.status(200).json({
            message: 'Sub Admin Removed'
        })

    } catch (error) {
        console.error("Error in Removing Sub-Admin:", error);
        return res.status(500).json({ 
            error: "Error in Removing Sub-Admin" 
        });
    }
})

router.post('/add-doctor', async(req, res) => {
    try {
        const details: doctorType = await req.body
        const zodResult = await doctorSchema.safeParse(details)
        if(!zodResult.success){
            return res.status(400).json({
                error: "Invalid Request",
              });
        }

        await prisma.doctor.create({
            data: {
                fullname: details.fullname,
                email: details.email,
                specializations: details.specializations,
                hospitals: details.hospitals,
                about: details.about,
                rating: details.rating
            }
        })

        return res.status(200).json({
            message: 'Doctor Added Successfully'
        })


    } catch (error) {
        console.error("Error in Adding Doctor:", error);
        return res.status(500).json({ 
            error: "Error in Adding Doctor"
        });
    }
})

router.post('/remove-doctor', async(req, res) => {
    try {
        const DoctorId: string = await req.body

        const response = await prisma.doctor.findFirst({
            where: {
                id: DoctorId
            }
        })

        if(!response){
            return res.status(409).json({
                error: 'Doctor Does Not Exist'
            })
        }

        await prisma.doctor.delete({
            where:{
                id: DoctorId
            }
        })

        return res.status(200).json({
            message: 'Doctor Removed Successfully'
        })

    } catch (error) {
        console.error("Error in Removing Doctor:", error);
        return res.status(500).json({ 
            error: "Error in Removing Doctor"
        });
    }
})


router.post('/logout', async(req, res) => {
    try {
        res.clearCookie('Admin')

        return res.status(200).json({
            message: 'Logout Successful'
        })

    } catch (error) {
        console.error("Error in Sub Admin Logout", error);
        return res.status(500).json({ 
            error: "Error in Sub Admin Logout" 
        });
    }
})

export const adminRoute = router;