import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
// import { sendOtpEmail } from "../middlewares/nodemailer";

const prisma = new PrismaClient();

// CHECK 1: A PATIENT CANNOT HAVE 5 ACTIVE APPOINTMENTS
// CHECK 2: A PATIENT CANNOT MAKE APPOINTMENT AFTER 6 MONTHS

const router = express.Router();

// Get all doctors (preview)
router.get('/doctors', async (req, res) => {
    try {
      const doctors = await prisma.doctor.findMany({
        select: {
          id: true,
          fullName: true
        },
        orderBy: {
          fullName: 'asc'
        }
      });
  
      return res.status(200).json({ doctors });
  
    } catch (error) {
      console.error("Error retrieving doctors:", error);
      return res.status(500).json({ 
        error: "Internal server error" 
      });
    }
});
  
// Get single doctor details
router.get('/getDoctor/:id', async (req: Request, res: Response) => {
    try {
      const doctorId = req.params.id;
  
      const doctor = await prisma.doctor.findUnique({
        where: { id: doctorId },
        select: {
          fullName: true,
          email: true,
          specialties: true,
          hospitalAffiliations: true,
          about: true,
          officePhone: true,
          address: true,
          latitude: true,
          longitude: true,
          rating: true,
          managedBy: {
            select: {
              fullName: true,
              email: true
            }
          }
        }
      });
  
      if (!doctor) {
        return res.status(404).json({ 
          message: "Doctor not found" 
        });
      }
  
      res.status(200).json({ 
        message: 'Successfully Fetch DOctor Details',
        doctor 
      });
  
    } catch (error) {
      console.error("Error retrieving doctor details:", error);
      return res.status(500).json({ 
        message: "Internal server error" 
      });
    }
});

export const doctortRoute = router;
