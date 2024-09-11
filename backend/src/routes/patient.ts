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

    } catch (error) {
        
    }
})


router.get('/get-patient', async(req, res) => {
    try {
        const detail = req.cookies.patientTemp;

        if(!detail){
            return res.status(400).json({
                error: "Unauthorized: Not Register"
            })
        }

        return res.json({
            detail: detail
        })

    } catch (error) {
        console.error("Error Retrieving Patient Details:", error);
        return res.status(401).json({ 
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
                phoneNumber: patientDetails.phoneNumber,
                DOB: patientDetails.DOB,
                gender: patientDetails.gender,
                address: patientDetails.address,
                emergencyContactName: patientDetails.emergencyContactName,
                emergencyContactNumber: patientDetails.emergencyContactNumber,
                primaryPhysician: patientDetails.primaryPhysician,
                allergies: patientDetails.allergies,
                currentMedications: patientDetails.currentMedications,
                medicalHistory: patientDetails.medicalHistory,
                familyMedicalHistory: patientDetails.familyMedicalHistory
            }
        })

        res.cookie('Patient', response.id , {
            httpOnly: true,
            secure: false,
            maxAge: 10 * 60 * 1000,
            sameSite: "lax",
        })


    } catch (error) {
        console.error("Error Adding Patient Details:", error);
        return res.status(401).json({ 
            error: "Error Adding Patient Details" 
        });
    }
})

export const patientRoute = router;