import express, { Request, Response } from "express";
import { AdminPermission, AdminRole, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
// import { sendOtpEmail } from "../middlewares/nodemailer";

const prisma = new PrismaClient();

const router = express.Router();

router.post("/adminLogin", async (req: Request, res: Response) => {
  try {
    const { email, pin } = req.body;

    if (!email || !pin) {
      return res.status(400).json({
        message: "All fields are required."
      });
    }

    const isAdminExists = await prisma.healthcareAdmin.findFirst({
      where: { email },
      select: {
        id: true,  
        email: true,
        fullName: true,
        pin: true,
        role: true,
        permissions: true,
      },
    });
    if (!isAdminExists) {
      return res.status(404).json({
        message: "Admin not found."
      });
    }

    // Compare pin
    const isMatch = await bcrypt.compare(pin, isAdminExists.pin);
    if (!isMatch) {
      return res.status(401).json({
        message: "Incorrect PIN."
      });
    }

    // Generate a token
    const token = ({
      id: isAdminExists.id,
      role: isAdminExists.role,
      permissions: isAdminExists.permissions,
    });

    // Set token in a secure HTTP-only cookie
    res.cookie("token", JSON.stringify(token), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      message: "Admin login successful.",
      data: {
        email: isAdminExists.email,
        role: isAdminExists.role,
        fullName: isAdminExists.fullName
      },
    });
  } catch (error) {
    console.error("Server Error in Admin Login:", error);
    return res.status(500).json({
      message: "Internal server error.",
      error: error,
    });
  }
});


router.get('/dashboard', async(req: Request, res: Response) => {
    try {
      console.log('hello');
      const token = req.cookies.token;
      const admin = JSON.parse(token);

      if (!admin) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const totalAdmins = await prisma.healthcareAdmin.count();
      const totalDoctors = await prisma.doctor.count();
      const activeAppointments = await prisma.appointment.count({
        where: { status: 'CONFIRMED' }
      })
      const recentAppointments = await prisma.appointment.findMany({
        where: { status: 'CONFIRMED' },
        include: {
          patient: { select: { fullName: true } },
          doctor: { select: { fullName: true } }
        },
        orderBy: { scheduledAt: 'desc' },
        take: 5
      })

      console.log(totalAdmins);
      console.log(totalDoctors);
      console.log(activeAppointments);
      console.log(recentAppointments);
  
      res.status(200).json({
        message: 'Successfully Fetched Dashboard Details',
        data: {
          stats: {
            totalAdmins,
            totalDoctors,
          },
          appointment: {
            activeAppointment: activeAppointments,
            recentAppointments: recentAppointments.map(appt => ({
              patient: appt.patient.fullName,
              doctor: appt.doctor.fullName,
              schedule: appt.scheduledAt.toISOString(),
              status: appt.status,
            }))
          }
        }
      });
      
    } catch (error) {
      console.log("Server Error in Fetching Admin Dashboard Details: ", error);
      res.status(500).json({
        message: "Server Error in Fetching Admin Dashboard Details",
        error: error
      })
    }    
})


router.get('/administration', async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;
    const admin = JSON.parse(token);

    if (!admin || admin.role !== AdminRole.SUPER_ADMIN) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const admins = await prisma.healthcareAdmin.findMany({
      select: {
        id: true,
        fullName: true,
        _count: {
          select: { managedDoctors: true },
        },
        lastAccess: true,
        role: true,
        verifiedBy: {
          select: { fullName: true },
        },
        isActive: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const formattedAdmins = admins.map(admin => ({
      id: admin.id,
      name: admin.fullName,
      doctorUnderManagement: admin._count.managedDoctors,
      lastActive: admin.lastAccess.toISOString(),
      activityStatus: admin.isActive ? 'Active' : 'Inactive',
      verifiedBy: admin.verifiedBy ? admin.verifiedBy.fullName : "Not Verified",
    }));

    res.status(200).json({
      message: 'Successfully Fetched Administration Details',
      data: formattedAdmins,
    });

  } catch (error) {
    console.error("Error Fetching Administration Details:", error);
    res.status(500).json({
      message: 'Failed to fetch administration data',
      error: error,
    });
  }
});


router.get('/doctors', async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;
    const admin = JSON.parse(token);

    if (admin.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ message: 'Not Authorized' });
    }

    const doctors = await prisma.doctor.findMany({
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


router.post("/activityUpdate/:id", async(req: Request, res: Response) => {
  try {
    const token = req.cookies.token;
    const admin = JSON.parse(token);

    if (!admin || admin.role !== AdminRole.SUPER_ADMIN) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const targetId = req.params.id;
    const { activityStatus } = req.body;

    const adminExists = await prisma.healthcareAdmin.findFirst({
      where: {
        id: targetId
      }
    })
    if(!adminExists){
      res.status(404).json({
        message: 'Admin Does Not Exists'
      })
    }

    await prisma.healthcareAdmin.update({
      where: {
        id: targetId
      },
      data: {
        isActive: activityStatus === 'Active' ? true : false
      }
    })

    res.status(200).json({
      message: 'Succesfully Updated Activity Status'
    })

  } catch (error) {
    console.error("Server Error in Admin Activity Status Updation:", error);
    res.status(500).json({
      message: "Server Error in Admin Activity Status Updation. Please Try Again",
      error: error
    });
  }
})


interface CreateAdminRequest {
  fullName: string;
  email: string;
  pin: string;
  role: AdminRole;
  permission: AdminPermission;
}
// Create Admin (Only by SUPER_ADMIN)
router.post("/addAdmin", async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;
    const creator = JSON.parse(token);

    if (!creator) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // FACILITY_ADMIN cannot create any admin
    if (creator.role === AdminRole.FACILITY_ADMIN) {
      return res.status(403).json({ message: "FACILITY_ADMIN cannot create admins" });
    }

    const { fullName, email, pin, role, permission }: CreateAdminRequest = req.body;

    // SUPER_ADMIN Creation Rules
    if (role === AdminRole.SUPER_ADMIN) {
      // Only SUPER_ADMIN with FULL_ACCESS can create another SUPER_ADMIN
      if (creator.role !== AdminRole.SUPER_ADMIN || creator.permissions !== AdminPermission.FULL_ACCESS) {
        return res.status(403).json({ message: "Only a SUPER_ADMIN with FULL_ACCESS can create a SUPER_ADMIN" });
      }

      // Check if there's already a SUPER_ADMIN with FULL_ACCESS
      const existingSuperAdmin = await prisma.healthcareAdmin.findFirst({
        where: { role: AdminRole.SUPER_ADMIN, permissions: AdminPermission.FULL_ACCESS }
      });

      if (existingSuperAdmin && permission === AdminPermission.FULL_ACCESS) {
        return res.status(400).json({ message: "Only one SUPER_ADMIN can have FULL_ACCESS" });
      }
    }

    // Hash PIN
    const hashedPin = await bcrypt.hash(pin, 12);

    await prisma.healthcareAdmin.create({
      data: {
        fullName,
        email,
        pin: hashedPin,
        role,
        permissions: permission,
        verifiedById: creator.id,
        lastAccess: new Date(),
        isActive: true
      }
    });

    res.status(201).json({
      message: "Admin Added Successfully",
    });

  } catch (error) {
    console.error("Admin creation error:", error);
    res.status(500).json({
      message: "Admin creation failed",
      error: error
    });
  }
});

// Delete Admin
// admin.full_access ==> admin.read&write
// admin.read&write => admin.facility_admin
// admin.facility => nothing
router.delete("/deleteAdmin/:id", async (req: Request, res: Response) => {
  try {
    const adminId = req.params.id;
    const token = req.cookies.token;
    const deleter = JSON.parse(token);

    if (!deleter) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // FACILITY_ADMIN cannot delete any admin
    if (deleter.role === AdminRole.FACILITY_ADMIN) {
      return res.status(403).json({ message: "FACILITY_ADMIN cannot delete admins" });
    }

    // Find the target admin to delete
    const targetAdmin = await prisma.healthcareAdmin.findUnique({
      where: { id: adminId },
    });

    if (!targetAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Prevent deletion of SUPER_ADMIN with FULL_ACCESS
    if (targetAdmin.role === AdminRole.SUPER_ADMIN && targetAdmin.permissions === AdminPermission.FULL_ACCESS) {
      return res.status(403).json({ message: "Cannot delete a SUPER_ADMIN with FULL_ACCESS" });
    }

    // SUPER_ADMIN with READ_WRITE can only be deleted by SUPER_ADMIN with FULL_ACCESS
    if (targetAdmin.role === AdminRole.SUPER_ADMIN && targetAdmin.permissions === AdminPermission.READ_WRITE) {
      if (deleter.role !== AdminRole.SUPER_ADMIN || deleter.permissions !== AdminPermission.FULL_ACCESS) {
        return res.status(403).json({ message: "Only a SUPER_ADMIN with FULL_ACCESS can delete a SUPER_ADMIN with READ_WRITE" });
      }
    }

    // Prevent deletion of the last SUPER_ADMIN with FULL_ACCESS
    if (targetAdmin.permissions === AdminPermission.FULL_ACCESS) {
      const remainingFullAccessAdmins = await prisma.healthcareAdmin.count({
        where: {
          role: AdminRole.SUPER_ADMIN,
          permissions: AdminPermission.FULL_ACCESS,
        },
      });

      if (remainingFullAccessAdmins <= 1) {
        return res.status(400).json({
          message: "Cannot delete the last SUPER_ADMIN with FULL_ACCESS",
        });
      }
    }

    // Delete the admin
    await prisma.healthcareAdmin.delete({
      where: { id: adminId },
    });

    res.status(200).json({
      message: "Admin Deleted Successfully",
    });

  } catch (error) {
    console.error("Admin deletion error:", error);
    res.status(500).json({
      message: "Admin deletion failed",
      error: error
    });
  }
});


export const adminLogout = async (_req: Request, res: Response) => {
  try {
    // Clear the auth cookie
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });

    return res.status(200).json({ message: 'Logout successful.' });
  } catch (error) {
    console.error('Error in Admin Logout:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};


export const adminRoute = router;