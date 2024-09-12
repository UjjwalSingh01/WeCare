import express from "express";
import cookieParser from "cookie-parser";
import { PrismaClient } from "@prisma/client";
import dayjs from 'dayjs'
import { AddAdminSchema, AddAdminType, AddSubAdminSchema, AddSubAdminType, doctorSchema, doctorType } from "../schema";
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
        return res.json({
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
                fullname: true
            }
        })

        const doctors = await prisma.doctor.count()

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

        const appointments = await prisma.appointment.findMany()

        return res.json({
            name: name?.fullname,
            doctors: doctors,
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
                removeFacility: detail.removeFacility
            }
        })

        return res.json({
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
    // not everyone will have this functionality
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

        return res.json({
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
        const SubAdminEmail: string = await req.body

        const response = await prisma.subAdmin.findFirst({
            where:{
                email: SubAdminEmail
            }
        })

        if(!response){
            return res.status(401).json({
                error: 'Sub Admin Does Not Exists'
            })
        }

        await prisma.subAdmin.delete({
            where:{
                email: SubAdminEmail
            }
        })

        return res.json({
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
                name: details.name,
                email: details.email,
                specializations: details.specializations,
                hospitals: details.hospitals,
                about: details.about,
                rating: details.rating
            }
        })

        return res.json({
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
        const DoctorEmail: string = await req.body

        const response = await prisma.doctor.findFirst({
            where: {
                email: DoctorEmail
            }
        })

        await prisma.doctor.delete({
            where:{
                id: DoctorEmail
            }
        })

        return res.json({
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

export const adminRoute = router;