"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appointmentRoute = void 0;
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
// import { sendOtpEmail } from "../middlewares/nodemailer";
const prisma = new client_1.PrismaClient();
const router = express_1.default.Router();
// Fetch Active Appointments
router.get('/getAppointments', async (req, res) => {
    try {
        const patientId = req.cookies.Patient;
        if (!patientId) {
            return res.status(401).json({
                message: "Unauthorized: Patient token not present"
            });
        }
        const appointments = await prisma.appointment.findMany({
            where: {
                patientId,
                status: { in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS'] }
            },
            select: {
                id: true,
                scheduledAt: true,
                doctor: {
                    select: { fullName: true }
                }
            },
            orderBy: {
                scheduledAt: 'asc'
            }
        });
        const doctors = await prisma.doctor.findMany({
            select: {
                id: true,
                fullName: true
            }
        });
        const formattedAppointments = appointments.map(a => {
            const dateObj = new Date(a.scheduledAt);
            return {
                appointmentId: a.id,
                date: dateObj.toISOString().split('T')[0], // YYYY-MM-DD
                time: dateObj.toTimeString().split(' ')[0], // HH:MM:SS
                doctorName: a.doctor.fullName,
            };
        });
        return res.status(200).json({
            appointments: formattedAppointments,
            doctors
        });
    }
    catch (error) {
        console.error("Error retrieving appointments:", error);
        return res.status(500).json({
            message: "Failed to retrieve appointments"
        });
    }
});
router.post('/makeAppointment', async (req, res) => {
    try {
        const patientId = req.cookies.Patient;
        if (!patientId) {
            return res.status(401).json({
                message: "Unauthorized: Patient token not present"
            });
        }
        const detail = req.body;
        // Parse combined date & time into a Date object
        const dateTimeString = `${detail.date} ${detail.time}`;
        const scheduledAt = new Date(dateTimeString);
        if (isNaN(scheduledAt.getTime())) {
            return res.status(400).json({ message: "Invalid date or time format" });
        }
        console.log(req.body);
        console.log(scheduledAt);
        // Cannot book in the past
        if (scheduledAt < new Date()) {
            return res.status(400).json({
                message: "You cannot book an appointment in the past"
            });
        }
        const appointmentCount = await prisma.appointment.count({
            where: {
                patientId,
                status: { in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS'] }
            }
        });
        if (appointmentCount >= 5) {
            return res.status(400).json({
                message: "You cannot have more than 5 appointments"
            });
        }
        const duplicateDoctorAppointment = await prisma.appointment.findFirst({
            where: {
                doctorId: detail.physician,
                scheduledAt,
                status: { in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS'] }
            }
        });
        if (duplicateDoctorAppointment) {
            return res.status(409).json({
                message: "Doctor already has an appointment at this date and time"
            });
        }
        const duplicatePatientAppointment = await prisma.appointment.findFirst({
            where: {
                patientId,
                scheduledAt,
                status: { in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS'] }
            }
        });
        if (duplicatePatientAppointment) {
            return res.status(409).json({
                message: "You already have an appointment at this date and time"
            });
        }
        await prisma.appointment.create({
            data: {
                doctorId: detail.physician,
                patientId,
                reason: detail.reason,
                clinicalNotes: detail.note,
                scheduledAt,
                status: 'PENDING'
            }
        });
        return res.status(200).json({
            message: 'Appointment Added Successfully'
        });
    }
    catch (error) {
        console.error('Error creating appointment:', error);
        return res.status(500).json({ error: "Internal Server Error: Unable to create appointment" });
    }
});
// CANCEL APPOINTMENT 
router.delete('/cancelAppointment/:id', async (req, res) => {
    try {
        const patientId = req.cookies.Patient;
        if (!patientId) {
            return res.status(401).json({
                message: "Unauthorized: Patient token not present"
            });
        }
        const id = req.params.id;
        console.log(id);
        const appointment = await prisma.appointment.findUnique({
            where: { id }
        });
        if (!appointment) {
            return res.status(404).json({
                message: "Appointment not found"
            });
        }
        if (appointment.patientId !== patientId) {
            res.status(401).json({
                message: 'Not Authorized To Cancel Appointment'
            });
        }
        await prisma.appointment.update({
            where: { id },
            data: { status: 'CANCELLED' }
        });
        return res.status(200).json({
            message: 'Appointment Cancelled Successfully'
        });
    }
    catch (error) {
        console.error("Error cancelling appointment:", error);
        return res.status(500).json({
            message: "Internal Server Error: Unable to cancel appointment"
        });
    }
});
exports.appointmentRoute = router;
