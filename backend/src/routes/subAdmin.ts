import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
// import { sendOtpEmail } from "../middlewares/nodemailer";

const prisma = new PrismaClient();

const router = express.Router();

// interface DashboardResponse {
//   totalAppointments: number;
//   monthlyDetails: {
//     currentMonth: number;
//     lastMonth: number;
//   };
//   recentAppointments: Array<{
//     id: string;
//     patientName: string;
//     doctorName: string;
//     reason: string;
//     scheduledAt: Date;
//     status: AppointmentStatus;
//   }>;
// }

interface CreateDoctorRequest {
  fullName: string;
  email: string;
  licenseNumber?: string;
  specialties: string[];
  hospitalAffiliations: string[];
  officePhone: string;
  availability: boolean; 
  about: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}

// interface UpdateDoctorRequest {
//   fullName?: string;
//   email?: string;
//   licenseNumber?: string;
//   specialties?: string[];
//   hospitalAffiliations?: string[];
//   officePhone?: string;
//   mobilePhone?: string;
//   availability?: object;
//   about?: string;
//   address?: string;
//   latitude?: number;
//   longitude?: number;
// }
  
// Get Dashboard Data
router.get('/dashboard', async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;
    const admin = JSON.parse(token);

    if (!admin || admin.role !== 'FACILITY_ADMIN') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Fetch managed doctors by the admin
    const managedDoctors = await prisma.doctor.findMany({
      where: { managedById: admin.id },
      select: { id: true },
    });

    const doctorIds = managedDoctors.map(d => d.id);

    // Fetch appointments for the managed doctors
    const appointments = await prisma.appointment.findMany({
      where: { doctorId: { in: doctorIds } },
      include: {
        patient: { select: { fullName: true } },
        doctor: { select: { fullName: true } },
      },
      orderBy: { scheduledAt: 'desc' },
    });

    // Calculate monthly stats
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = (currentMonth - 1 + 12) % 12;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const currentMonthAppointments = appointments.filter(a => 
      a.scheduledAt.getMonth() === currentMonth && 
      a.scheduledAt.getFullYear() === currentYear
    ).length;

    const lastMonthAppointments = appointments.filter(a => 
      a.scheduledAt.getMonth() === lastMonth &&
      a.scheduledAt.getFullYear() === lastMonthYear
    ).length;

    // Prepare recent appointments
    const recentAppointments = appointments.slice(0, 15).map(a => ({
      id: a.id,
      patientName: a.patient.fullName,
      doctorName: a.doctor.fullName,
      reason: a.reason,
      date: a.scheduledAt.toISOString().split('T')[0],
      time: a.scheduledAt.toISOString().split('T')[1].slice(0, 5),
      status: a.status,
    }));

    res.status(200).json({
      name: admin.fullName,
      totalAppointments: appointments.length,
      monthlyDetails: {
        currentMonthAppointments: currentMonthAppointments,
        lastMonthAppointments: lastMonthAppointments,
      },
      recentAppointments,
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Failed to load dashboard data' });
  }
});


// Get Managed Doctors
router.get('/doctors', async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;
    const admin = JSON.parse(token);

    if (admin.role !== 'FACILITY_ADMIN') {
      return res.status(403).json({ message: 'Not Authorized' });
    }

    const doctors = await prisma.doctor.findMany({
      where: { managedById: admin.id },
      include: {
        appointments: {
        orderBy: { scheduledAt: 'desc' },
        take: 1,
        select: { scheduledAt: true }
        }
      }
    });

    const formattedDoctors = doctors.map(doctor => ({
      id: doctor.id,
      name: doctor.fullName,
      licenseNumber: doctor.licenseNumber || 'N/A',
      totalAppointments: doctor.appointments.length,
      lastAppointment: doctor.appointments[0]?.scheduledAt.toISOString() || 'N/A',
      status: doctor.verified ? 'ACTIVE' : 'INACTIVE',
      added: doctor.createdAt.toISOString(),
      verified: doctor.verified ? true : false,
      rating: doctor.rating
    }));

    res.status(200).json({
      message: "Successfully Fetched Doctor Details",
      data: formattedDoctors
    });

  } catch (error) {
    console.error('Doctors error:', error);
    res.status(500).json({ message: 'Failed to load doctors' });
  }
});


router.put('/updateAppointmentStatus', async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;
    const admin = JSON.parse(token);

    // Check if the user is an authenticated admin
    if (!admin || admin.role !== 'FACILITY_ADMIN') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { id, status } = req.body;

    // Validate status against AppointmentStatus enum
    const validStatuses = ['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid appointment status' });
    }

    // Fetch appointment details
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: { doctor: true }
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if the doctor is managed by the admin
    if (appointment.doctor.managedById !== admin.id) {
      return res.status(403).json({ message: 'Unauthorized: You do not manage this doctor' });
    }

    // Update the appointment status
    await prisma.appointment.update({
      where: { id },
      data: { status },
    });

    res.status(200).json({
      message: 'Appointment status updated successfully',
    });
    
  } catch (error) {
    console.error('Error updating appointment status:', error);
    res.status(500).json({ message: 'Failed to update appointment status' });
  }
});


// Add Doctor
router.post("/addDoctor", async (req: Request, res: Response) => {
  try {
    console.log(req.body);

    const token = req.cookies.token;
    const admin = JSON.parse(token);

    // Ensure the request is from an admin
    if (!admin || (admin.role !== 'FACILITY_ADMIN' && admin.role !== 'SUPER_ADMIN')) {
      return res.status(403).json({ message: 'Unauthorized: Only admins can add doctors' });
    }

    const doctorData: CreateDoctorRequest = req.body;

    // Validate required fields
    if (!doctorData.fullName || !doctorData.email || !doctorData.officePhone) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if email already exists
    const existingDoctor = await prisma.doctor.findUnique({ where: { email: doctorData.email } });
    if (existingDoctor) {
      return res.status(400).json({ message: 'Doctor with this email already exists' });
    }

    // Create new doctor
    await prisma.doctor.create({
      data: {
        ...doctorData,
        rating: 5,
        managedBy: { connect: { id: admin.id } },
        verified: admin.role === 'SUPER_ADMIN',
        specialties: doctorData.specialties || [],
        hospitalAffiliations: doctorData.hospitalAffiliations || [],
      },
    });

    res.status(201).json({
      message: 'Doctor added successfully',
    });

  } catch (error) {
    console.error('Add doctor error:', error);
    res.status(500).json({ message: 'Failed to add doctor' });
  }
});


// Delete Doctor
router.delete('/deleteDoctor/:id', async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;
    const admin = JSON.parse(token);

    // Ensure the request is from a valid admin
    if (!admin || (admin.role !== 'FACILITY_ADMIN' && admin.role !== 'SUPER_ADMIN')) {
      return res.status(403).json({ message: 'Unauthorized: Only admins can delete doctors' });
    }

    const doctorId = req.params.id;

    // Find the doctor
    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
      select: { managedById: true }
    });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Check if the doctor is managed by this admin
    if (admin.role === 'FACILITY_ADMIN' && doctor.managedById !== admin.id) {
      return res.status(403).json({ message: 'Unauthorized: You do not manage this doctor' });
    }

    // Delete doctor
    await prisma.doctor.delete({ where: { id: doctorId } });

    res.status(200).json({ message: "Doctor deleted successfully" });

  } catch (error) {
    console.error('Delete doctor error:', error);
    res.status(500).json({ message: 'Failed to delete doctor' });
  }
});
  

export const subAdminRouter = router;