import express from "express";
import { PrismaClient } from "@prisma/client";
// import { sendOtpEmail } from "../middlewares/nodemailer";

const prisma = new PrismaClient();

const app = express();
app.use(express.json());

const router = express.Router();

interface RegisterType {
  email: string;
  fullName: string;
  phoneNumber: string;
}
// Register (Temporary - Cookie Based)
router.post('/register', async (req, res) => {
  try {
    const detail: RegisterType = req.body;
    console.log(detail);

    // Store in a temporary cookie for 10 minutes
    res.cookie("patientTemp", JSON.stringify(detail), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 60 * 60 * 1000
    });

    return res.status(200).json({ 
      message: "Patient registered successfully" 
    });

  } catch (error) {
    console.error("Error in Patient Registration:", error);
    return res.status(500).json({ 
      message: "Failed to register patient" 
    });
  }
});


router.get('/get-patient', async (req, res) => {
  try {
    const cookieData = req.cookies.patientTemp;

    if (!cookieData) {
      return res.status(404).json({ 
        message: "No registration data found" 
      });
    }

    const parsedData = JSON.parse(cookieData);
    const detail: RegisterType = parsedData;

    const doctors = await prisma.doctor.findMany({
      select: { id: true, fullName: true }
    });

    return res.status(200).json({
      fullName: detail.fullName,
      email: detail.email,
      phoneNumber: detail.phoneNumber,
      doctors,
    });

  } catch (error) {
    console.error("Error retrieving patient details:", error);
    return res.status(500).json({ 
      message: "Failed to retrieve patient details" 
    });
  }
});


// Register Patient (Permanent)
router.post('/registerPatient', async (req, res) => {
  try {
    const patientDetails = req.body;
    console.log(patientDetails);

    // Check if email or phone already exists
    const existingPatient = await prisma.patient.findFirst({
      where: {
        OR: [
          { email: patientDetails.email },
          { phoneNumber: patientDetails.phoneNumber }
        ]
      }
    });
    if (existingPatient) {
      return res.status(400).json({ 
        message: 'Patient with this email or phone number already exists' 
      });
    }

    // Create new patient with proper field mapping
    const newPatient = await prisma.patient.create({
      data: {
        fullName: patientDetails.fullName,
        email: patientDetails.email,
        phoneNumber: patientDetails.phoneNumber,
        dob: new Date(patientDetails.dob),
        gender: patientDetails.gender,
        address: patientDetails.address,
        emergencyContactName: patientDetails.emergencyContactName || undefined,
        emergencyContactNumber: patientDetails.emergencyContactNumber || undefined,
        allergies: patientDetails.allergies || [],
        currentMedications: patientDetails.currentMedications || [],
        medicalHistory: patientDetails.medicalHistory || undefined,
        familyMedicalHistory: patientDetails.familyMedicalHistory || undefined,
        insuranceProvider: patientDetails.insuranceProvider || undefined,
        policyNumber: patientDetails.policyNumber || undefined
      }
    });

    console.log(newPatient);

    // Session management
    res.clearCookie('patientTemp');
    res.cookie('Patient', newPatient.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000
    });

    return res.status(201).json({ 
      message: 'Patient registered successfully',
    });

  } catch (error) {
    console.error("Patient registration error:", error);
    return res.status(500).json({ 
      message: "Internal server error during registration" 
    });
  }
});

// Patient Logout
router.post('/logout', async (req, res) => {
  try {
    res.clearCookie('Patient');
    return res.status(200).json({ message: 'Logout successful' });

  } catch (error) {
    console.error("Error in patient logout:", error);
    return res.status(500).json({ message: "Failed to logout" });
  }
});

export const patientRoute = router;