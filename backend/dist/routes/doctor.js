"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.doctortRoute = void 0;
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const client_1 = require("@prisma/client");
// import { sendOtpEmail } from "../middlewares/nodemailer";
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
const JWT_SECRET = process.env.JWT_SECRET;
// CHECK 1: A PATIENT CANNOT HAVE 5 ACTIVE APPOINTMENTS
// CHECK 2: A PATIENT CANNOT MAKE APPOINTMENT AFTER 6 MONTHS
const router = express_1.default.Router();
router.get('/get-doctor', async (req, res) => {
    try {
        const doctors = await prisma.doctor.findMany({
            select: {
                id: true,
                fullname: true
            }
        });
        return res.status(200).json({
            doctor: doctors
        });
    }
    catch (error) {
        console.error("Error Retrieving ALL Doctors Details:", error);
        return res.status(500).json({
            error: "Error Retrieving ALL Doctors Details"
        });
    }
});
router.get('/get-doctor/:id', async (req, res) => {
    try {
        const DoctorId = req.params.id;
        const response = await prisma.doctor.findFirst({
            where: {
                id: DoctorId,
            },
            select: {
                fullname: true,
                email: true,
                specializations: true,
                hospitals: true,
                about: true,
                phoneNumber: true,
                address: true,
                latitude: true,
                longitude: true,
                admin: true,
                rating: true,
            },
        });
        if (!response) {
            return res.json({
                error: 'Doctor Does Not Exists'
            });
        }
        return res.json({
            doctor: response
        });
    }
    catch (error) {
        console.error("Error Retrieving Doctor Details:", error);
        return res.status(500).json({
            error: "Error Retrieving Doctor Details"
        });
    }
});
exports.doctortRoute = router;
