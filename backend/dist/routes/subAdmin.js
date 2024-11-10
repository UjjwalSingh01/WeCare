"use strict";
// 1. Doctor details
// 2. Update schedule -> completed | cancelled
// 3. get-doctor appointments
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subAdminRouter = void 0;
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const client_1 = require("@prisma/client");
const dayjs_1 = __importDefault(require("dayjs"));
const zod_1 = require("zod");
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
// interface SubAdminDetail {
//     email: string,
//     pin: string
// }
// router.post('/subadmin-login', async(req, res) => {
//     try {
//         const detail: SubAdminDetail = await req.body;
//         const response = await prisma.subAdmin.findFirst({
//             where:{
//                 email: detail.email
//             }
//         })
//         if(!response){
//             return res.status(401).json({
//                 error: 'Sub-Admin Does Not Exists'
//             })
//         }
//         if(response.pin != detail.pin){
//             return res.status(401).json({
//                 error: 'Invalid Pin'
//             })
//         }
//         res.cookie('subAdmin', response.id , {
//             httpOnly: true,
//             secure: false,
//             maxAge: 12 * 60 * 1000,
//             sameSite: 'lax'
//         })
//         return res.json({
//             message: 'Login Successful'
//         })
//     } catch (error) {
//         console.error("Error Logging in Sub Admin", error);
//         return res.status(500).json({ 
//             error: "Error in Logging in Sub Admin" 
//         });
//     }
// })
router.get('/subAdmin-dashboard', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subAdminId = req.cookies.subAdmin;
        if (!subAdminId) {
            return res.status(401).json({
                error: "Unauthorized: No token provided."
            });
        }
        const name = yield prisma.subAdmin.findFirst({
            where: {
                id: subAdminId
            },
            select: {
                fullname: true
            }
        });
        if (!name) {
            return res.status(401).json({
                error: "Sub Admin does Not Exist"
            });
        }
        const subAdmin = yield prisma.subAdmin.findUnique({
            where: {
                id: subAdminId,
            },
            select: {
                doctors: true,
            },
        });
        if (!subAdmin) {
            throw new Error("SubAdmin not found");
        }
        const doctorIds = subAdmin.doctors;
        const appointments = yield prisma.appointment.findMany({
            where: {
                doctorId: {
                    in: doctorIds,
                },
            },
            select: {
                id: true,
                reason: true,
                date: true,
                time: true,
                status: true,
                patient: {
                    select: {
                        fullname: true,
                    },
                },
                doctor: {
                    select: {
                        fullname: true,
                    },
                },
            },
        });
        const formattedAppointments = appointments.map((appointment) => ({
            appointmentId: appointment.id,
            patientName: appointment.patient.fullname,
            doctor: appointment.doctor.fullname,
            date: appointment.date,
            time: appointment.time,
            status: appointment.status,
            reason: appointment.reason,
        }));
        const now = (0, dayjs_1.default)();
        // Get start and end dates of the current month (formatted as 'YYYY-MM-DD')
        const startOfCurrentMonth = now.startOf('month').format('MMMM D, YYYY');
        const endOfCurrentMonth = now.endOf('month').format('MMMM D, YYYY');
        // Get start and end dates of the last month (formatted as 'YYYY-MM-DD')
        const startOfLastMonth = now.subtract(1, 'month').startOf('month').format('MMMM D, YYYY');
        const endOfLastMonth = now.subtract(1, 'month').endOf('month').format('MMMM D, YYYY');
        // Count appointments in the current month
        const currentMonthAppointments = yield prisma.appointment.count({
            where: {
                date: {
                    gte: startOfCurrentMonth,
                    lte: endOfCurrentMonth,
                },
            },
        });
        // Count appointments in the last month
        const lastMonthAppointments = yield prisma.appointment.count({
            where: {
                date: {
                    gte: startOfLastMonth,
                    lte: endOfLastMonth,
                },
            },
        });
        const totalAppointments = yield prisma.appointment.count({
            where: {
                doctorId: {
                    in: doctorIds,
                },
            },
        });
        return res.json({
            name: name.fullname,
            appointments: formattedAppointments,
            monthly: { currentMonthAppointments, lastMonthAppointments },
            totalAppointments: totalAppointments
        });
    }
    catch (error) {
        console.error("Error in Sub Admin Dashboard Details", error);
        return res.status(500).json({
            error: "Error in Sub Admin Dashboard Details"
        });
    }
}));
const SubAdminUpdateSchema = zod_1.z.object({
    fullname: zod_1.z.string().min(2, 'Name Must Contain Atleast 2 Characters'),
    email: zod_1.z.string().email('Enter Correct Email Format'),
    pin: zod_1.z.string().length(6, 'Pin must be exactly 6 digits').regex(/^\d{6}$/, 'Pin must only contain digits'),
});
router.post('/update-profile', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const detail = yield req.body;
    try {
        const subAdminId = req.cookies.subAdmin;
        if (!subAdminId) {
            return res.status(401).json({
                error: "Unauthorized: No token provided."
            });
        }
        const zodResult = yield SubAdminUpdateSchema.safeParse(detail);
        if (!zodResult.success) {
            return res.status(401).json({
                error: 'Invalid Credentials'
            });
        }
        yield prisma.subAdmin.update({
            where: {
                id: subAdminId
            },
            data: {
                fullname: detail.fullname,
                email: detail.email,
                pin: detail.pin
            }
        });
        return res.json({
            message: 'Updated Successfully'
        });
    }
    catch (error) {
        console.error("Error in Sub Admin Updation", error);
        return res.status(500).json({
            error: "Error in Sub Admin Updation"
        });
    }
}));
router.post('/update', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const appointmentsToUpdate = yield req.body;
    try {
        yield Promise.all(appointmentsToUpdate.map((appointment) => __awaiter(void 0, void 0, void 0, function* () {
            yield prisma.appointment.update({
                where: {
                    id: appointment.id,
                },
                data: {
                    status: appointment.status,
                },
            });
        })));
        return res.json({
            message: "Appointments updated successfully"
        });
    }
    catch (error) {
        console.error("Error in Sub Admin in Updating Appointment", error);
        return res.status(500).json({
            error: "Error in Sub Admin in Updating Appointment"
        });
    }
}));
router.post('/logout', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie('subAdmin');
        return res.json({
            message: 'Logout Successful'
        });
    }
    catch (error) {
        console.error("Error in Sub Admin Logout", error);
        return res.status(500).json({
            error: "Error in Sub Admin Logout"
        });
    }
}));
exports.subAdminRouter = router;
