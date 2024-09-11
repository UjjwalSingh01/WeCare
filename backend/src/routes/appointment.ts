import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
// import { PrismaClient } from "@prisma/client";
// import { sendOtpEmail } from "../middlewares/nodemailer";

// const prisma = new PrismaClient();

const app = express();
app.use(express.json());
app.use(cookieParser());

const JWT_SECRET = process.env.JWT_SECRET as string;

// CHECK 1: A PATIENT CANNOT HAVE 5 ACTIVE APPOINTMENTS
// CHECK 2: A PATIENT CANNOT MAKE APPOINTMENT AFTER 6 MONTHS

const router = express.Router();

router.post('/get-appointment', async(req, res) => {

})

router.post('/make-appointment', async(req, res) => {

})

router.post('/cancel-appointment', async(req, res) => {
    
})

// appointment ids ayengi completed or cancelled from the manager of the doctor
router.post('/update-appointment', async(req, res) => {
    
})

export const appointmentRoute = router;
