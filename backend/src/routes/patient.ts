import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { PrismaClient } from "@prisma/client";
import { patientType, registerSchema, registerType } from "../schema";
import { error } from "console";
// import { sendOtpEmail } from "../middlewares/nodemailer";

const prisma = new PrismaClient();


const app = express();
app.use(express.json());
app.use(cookieParser());


const router = express.Router();

router.post('/register', async(req, res) => {
    try {
        const detail: registerType = await req.body
        const zodResult = await registerSchema.safeParse(detail)
        if(!zodResult.success){
            return res.status(400).json({
                error: "Invalid Request",
              });
        }

        res.cookie("patientTemp", detail, {
            httpOnly: true,
            secure: false, 
            maxAge: 10 * 60 * 1000,
            sameSite: "lax",
        });

        return res.status(200).json({ 
            message: "Patient registered successfully" 
        });

    } catch (error) {
        console.error("Error in Patient Registration:", error);
        return res.status(500).json({ 
            error: "Error in Patient Registration:" 
        });   
    }
})


router.get('/get-patient', async(req, res) => {
    try {
        const detail: registerType = req.cookies.patientTemp;

        if(!detail){
            return res.status(400).json({
                error: "Unauthorized: Not Register"
            })
        }

        const doctors = await prisma.doctor.findMany({
            select:{
                id: true,
                fullname: true
            }
        })

        return res.json({
            fullname: detail.fullname,
            email: detail.email,
            patientPhone: detail.phoneNumber,
            doctors: doctors
        })

    } catch (error) {
        console.error("Error Retrieving Patient Details:", error);
        return res.status(500).json({ 
            error: "Error Retrieving Patient Details" 
        });
    }
})


router.post('/registerPatient', async(req, res) => {
    try {
        const patientDetails: patientType = await req.body;
        const zodResult = await registerSchema.safeParse(patientDetails)
        if(!zodResult.success){
            return res.status(400).json({
                error: "Invalid Request",
              });
        }

        const response = await prisma.patient.create({
            data: {
                fullname: patientDetails.fullname,
                email: patientDetails.email,
                phoneNumber: patientDetails.patientPhone,
                DOB: patientDetails.dob,
                gender: patientDetails.gender,
                address: patientDetails.address,
                emergencyContactName: patientDetails.emergencyContactName,
                emergencyContactNumber: patientDetails.emergenyPhone,
                primaryPhysician: patientDetails.primaryPhysician,
                allergies: patientDetails.allergies,
                currentMedications: patientDetails.medications,
                medicalHistory: patientDetails.medicalHistory,
                familyMedicalHistory: patientDetails.familyMedicalHistory
            }
        })

        res.cookie('Patient', response.id , {
            httpOnly: true,
            secure: false,
            maxAge: 12 * 60 * 60 * 1000,
            sameSite: "lax",
        })

        return res.status(200).json({
            message: 'Patient Details Added Successfully'
        })


    } catch (error) {
        console.error("Error Adding Patient Details:", error);
        return res.status(500).json({ 
            error: "Error Adding Patient Details" 
        });
    }
})


router.post('/logout', async(req, res) => {
    try {
        res.clearCookie('Patient')

        return res.json({
            message: 'Logout Successful'
        })

    } catch (error) {
        console.error("Error in Patient Logout", error);
        return res.status(500).json({ 
            error: "Error in Patient Logout" 
        });
    }
})

export const patientRoute = router;