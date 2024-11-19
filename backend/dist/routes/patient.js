"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.patientRoute = void 0;
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const client_1 = require("@prisma/client");
const schema_1 = require("../schema");
const cors_1 = __importDefault(require("cors"));
// import { sendOtpEmail } from "../middlewares/nodemailer";
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173', // Your frontend URL
    credentials: true, // Allow credentials (cookies, headers)
}));
const router = express_1.default.Router();
router.post('/register', async (req, res) => {
    try {
        const detail = await req.body;
        const zodResult = schema_1.registerSchema.safeParse(detail);
        if (!zodResult.success) {
            return res.status(400).json({
                error: "Invalid Request",
            });
        }
        res.cookie("patientTemp", JSON.stringify(detail), {
            httpOnly: true,
            secure: false,
            maxAge: 10 * 60 * 1000,
            sameSite: "lax",
        });
        return res.status(200).json({
            message: "Patient registered successfully"
        });
    }
    catch (error) {
        console.error("Error in Patient Registration:", error);
        return res.status(500).json({
            error: "Error in Patient Registration:"
        });
    }
});
router.get('/get-patient', async (req, res) => {
    try {
        const cookieData = req.cookies.patientTemp;
        if (!cookieData) {
            return res.status(404).json({ error: "No cookie found" });
        }
        const parsedData = JSON.parse(cookieData);
        const zodResult = schema_1.registerSchema.safeParse(parsedData);
        if (!zodResult.success) {
            return res.status(400).json({
                error: "Invalid Request",
            });
        }
        const detail = zodResult.data;
        if (!detail) {
            return res.status(400).json({
                error: "Unauthorized: Not Register"
            });
        }
        const doctors = await prisma.doctor.findMany({
            select: {
                id: true,
                fullname: true
            }
        });
        return res.status(200).json({
            fullname: detail.fullname,
            email: detail.email,
            patientPhone: detail.phoneNumber,
            doctors: doctors
        });
    }
    catch (error) {
        console.error("Error Retrieving Patient Details:", error);
        return res.status(500).json({
            error: "Error Retrieving Patient Details"
        });
    }
});
router.post('/registerPatient', async (req, res) => {
    try {
        const patientDetails = await req.body;
        const zodResult = schema_1.registerSchema.safeParse(patientDetails);
        if (!zodResult.success) {
            console.error(zodResult.error.issues);
            return res.status(400).json({
                error: "Invalid Request",
            });
        }
        const existingPatient = await prisma.patient.findFirst({
            where: { email: patientDetails.email },
        });
        if (existingPatient) {
            return res.status(400).json({ error: 'Email already exists.' });
        }
        const response = await prisma.patient.create({
            data: {
                fullname: patientDetails.fullname,
                email: patientDetails.email,
                phoneNumber: patientDetails.phoneNumber,
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
        });
        res.clearCookie('patientTemp');
        res.cookie('Patient', response.id, {
            httpOnly: true,
            secure: false,
            maxAge: 12 * 60 * 60 * 1000,
            sameSite: "lax",
        });
        return res.status(200).json({
            message: 'Patient Details Added Successfully'
        });
    }
    catch (error) {
        console.error("Error Adding Patient Details:", error);
        return res.status(500).json({
            error: "Error Adding Patient Details"
        });
    }
});
router.post('/logout', async (req, res) => {
    try {
        res.clearCookie('Patient');
        return res.json({
            message: 'Logout Successful'
        });
    }
    catch (error) {
        console.error("Error in Patient Logout", error);
        return res.status(500).json({
            error: "Error in Patient Logout"
        });
    }
});
exports.patientRoute = router;