"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appointmentRoute = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const client_1 = require("@prisma/client");
const schema_1 = require("../schema");
// import { sendOtpEmail } from "../middlewares/nodemailer";
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173',
    credentials: true,
}));
const JWT_SECRET = process.env.JWT_SECRET;
const router = express_1.default.Router();
router.get('/get-appointment', async (req, res) => {
    try {
        const patientId = await req.cookies.Patient;
        // console.log(req.cookies.Patient)
        const appointments = await prisma.appointment.findMany({
            where: {
                patientId: patientId,
                status: 'ACTIVE',
            },
            select: {
                id: true,
                date: true,
                time: true,
                doctor: {
                    select: {
                        fullname: true,
                    },
                },
            },
        });
        const result = appointments.map(appointment => ({
            appointmentId: appointment.id,
            date: appointment.date,
            time: appointment.time,
            doctorName: appointment.doctor.fullname,
        }));
        const doctors = await prisma.doctor.findMany({
            select: {
                fullname: true,
                id: true
            }
        });
        return res.status(200).json({
            appointments: result,
            doctors: doctors
        });
    }
    catch (error) {
        console.error("Error in Retrieving Appointments", error);
        return res.status(500).json({
            error: "Error in Retrieving Appointments"
        });
    }
});
router.post('/make-appointment', async (req, res) => {
    try {
        const detail = await req.body;
        const zodResult = schema_1.appointmentSchema.safeParse(detail);
        if (!zodResult.success) {
            return res.status(401).json({
                error: 'Invalid Credentials'
            });
        }
        // CANNOT MAKE AN APPOINTMENT BEFORE CURRET TIME
        const patientId = await req.cookies.Patient;
        if (!patientId) {
            return res.status(401).json({
                error: "Unauthorized: Patient token not present",
            });
        }
        const response = await prisma.appointment.count({
            where: {
                patientId: patientId,
                status: 'ACTIVE'
            }
        });
        if (response == 5) {
            return res.status(400).json({
                error: "You cannot have more than 5 appointments",
            });
        }
        const duplicateAppointment = await prisma.appointment.findFirst({
            where: {
                doctorId: detail.physician,
                date: detail.date,
                time: detail.time,
                status: 'ACTIVE'
            }
        });
        if (duplicateAppointment) {
            return res.status(409).json({
                error: "Appointment is Not Available at this date and time",
            });
        }
        const duplicatePatientAppointment = await prisma.appointment.findFirst({
            where: {
                patientId: patientId,
                date: detail.date,
                time: detail.time,
                status: 'ACTIVE'
            }
        });
        if (duplicatePatientAppointment) {
            return res.status(409).json({
                error: "You Already have an Appointment at this Date & Time",
            });
        }
        await prisma.appointment.create({
            data: {
                doctorId: detail.physician,
                patientId: patientId,
                reason: detail.reason,
                note: detail.note,
                date: detail.date,
                time: detail.time,
                status: 'ACTIVE'
            }
        });
        return res.status(200).json({
            message: 'Appointment Added Successfully'
        });
    }
    catch (error) {
        console.error('Error creating appointment:', error);
        return res.status(500).json({
            error: "Internal Server Error: Unable to create appointment",
        });
    }
});
router.post('/cancel-appointment', async (req, res) => {
    try {
        const { id } = await req.body;
        console.log(id);
        const appointment = await prisma.appointment.findFirst({
            where: {
                id: id
            }
        });
        if (!appointment) {
            return res.status(200).json({
                error: "Appointment Not Present"
            });
        }
        await prisma.appointment.update({
            where: {
                id: id
            },
            data: {
                status: 'CANCELLED'
            }
        });
        // await prisma.appointment.update({
        //     where: {
        //         id: id,
        //     },
        //     data: {
        //         status: 'CANCELLED',
        //     }
        // });
        return res.status(200).json({
            message: 'Appointment Cancelled Successfully'
        });
    }
    catch (error) {
        console.error("Error in Cancelling Appointments", error);
        return res.status(500).json({
            error: "Error in Cancelling Appointments"
        });
    }
});
router.post('/update-appointment', async (req, res) => {
    try {
        const detail = await req.body;
        const response = await prisma.appointment.findFirst({
            where: {
                id: detail.id
            }
        });
        if (!response) {
            return res.status(401).json({
                error: "Appointment Does Not Exists"
            });
        }
        await prisma.appointment.update({
            where: {
                id: detail.id
            },
            data: {
                status: detail.action
            }
        });
        return res.status(200).json({
            message: 'Appointment Updated Successful'
        });
    }
    catch (error) {
        console.error("Error in Updating Appointments", error);
        return res.status(500).json({
            error: "Error in Updating Appointments"
        });
    }
});
exports.appointmentRoute = router;