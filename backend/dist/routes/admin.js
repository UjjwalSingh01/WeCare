"use strict";
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
exports.adminRoute = void 0;
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const client_1 = require("@prisma/client");
const dayjs_1 = __importDefault(require("dayjs"));
const schema_1 = require("../schema");
// import { sendOtpEmail } from "../middlewares/nodemailer";
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
const router = express_1.default.Router();
router.post('/admin-login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const detail = yield req.body;
        const response = yield prisma.admin.findFirst({
            where: {
                email: detail.email,
            }
        });
        if (response) {
            if (response.pin != detail.pin) {
                return res.status(401).json({
                    error: 'Invalid Credential'
                });
            }
            res.cookie("Admin", response.id, {
                httpOnly: true,
                secure: false,
                maxAge: 12 * 60 * 60 * 1000,
                sameSite: "lax",
            });
            return res.status(200).json({
                message: 'Admin'
            });
        }
        const subAdmin = yield prisma.subAdmin.findFirst({
            where: {
                email: detail.email
            }
        });
        if (subAdmin) {
            if (subAdmin.pin != detail.pin) {
                return res.status(401).json({
                    error: 'Invalid Credential'
                });
            }
            res.cookie('subAdmin', subAdmin.id, {
                httpOnly: true,
                secure: false,
                maxAge: 12 * 60 * 1000,
                sameSite: 'lax'
            });
            return res.status(200).json({
                message: 'Sub Admin'
            });
        }
        return res.status(401).json({
            error: 'Admin Does Not Exists'
        });
    }
    catch (error) {
        console.error("Error in Admin Login:", error);
        return res.status(500).json({
            error: "Error in Admin Login"
        });
    }
}));
router.get('/admin-dashboard', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const AdminId = yield req.cookies.Admin;
        const name = yield prisma.admin.findFirst({
            where: {
                id: AdminId,
            },
            select: {
                removeFacility: true,
                fullname: true
            }
        });
        const doctors = yield prisma.doctor.findMany({
            select: {
                fullname: true,
                id: true
            }
        });
        const totalAppointment = yield prisma.appointment.count();
        const now = (0, dayjs_1.default)();
        // Get start and end dates of the current month (formatted as 'MMMM D, YYYY')
        const startOfCurrentMonth = now.startOf('month').format('MMMM D, YYYY');
        const endOfCurrentMonth = now.endOf('month').format('MMMM D, YYYY');
        // Get start and end dates of the last month (formatted as 'MMMM D, YYYY')
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
        const appointment = yield prisma.appointment.findMany({
            select: {
                date: true,
                time: true,
                status: true,
                doctor: {
                    select: {
                        fullname: true,
                    }
                },
                patient: {
                    select: {
                        fullname: true
                    }
                }
            }
        });
        const appointments = appointment.map(appointment => ({
            doctorname: appointment.doctor.fullname,
            patientname: appointment.patient.fullname,
            date: appointment.date,
            time: appointment.time,
            status: appointment.status
        }));
        const subadmin = yield prisma.subAdmin.findMany({
            select: {
                id: true,
                fullname: true
            }
        });
        let admins = [];
        if ((name === null || name === void 0 ? void 0 : name.removeFacility) === true) {
            admins = yield prisma.admin.findMany({
                select: {
                    id: true,
                    fullname: true
                }
            });
        }
        return res.status(200).json({
            name: name === null || name === void 0 ? void 0 : name.fullname,
            doctors: doctors,
            subadmins: subadmin,
            admins: admins,
            doctorCount: doctors.length,
            total: totalAppointment,
            monthly: { currentMonthAppointments, lastMonthAppointments },
            appointments: appointments,
        });
    }
    catch (error) {
        console.error("Error in Admin DashBoard Details:", error);
        return res.status(500).json({
            error: "Error in Admin DashBoard Details"
        });
    }
}));
router.post('/add-admin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const detail = yield req.body;
        const zodResult = schema_1.AddAdminSchema.safeParse(detail);
        if (!zodResult.success) {
            return res.status(401).json({
                error: 'InValid Credentials'
            });
        }
        yield prisma.admin.create({
            data: {
                fullname: detail.fullname,
                email: detail.email,
                pin: detail.pin,
                removeFacility: detail.removeFacility
            }
        });
        return res.status(200).json({
            message: 'Admin Added Successfully'
        });
    }
    catch (error) {
        console.error("Error in Adding Admin:", error);
        return res.status(500).json({
            error: "Error in Adding Admin"
        });
    }
}));
router.post('/remove-admin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { removeId } = yield req.body;
        const response = yield prisma.admin.findFirst({
            where: {
                id: removeId
            }
        });
        if (!response) {
            return res.status(401).json({
                message: "Admin Does not Exist"
            });
        }
        yield prisma.admin.delete({
            where: {
                id: removeId,
                email: response.email
            }
        });
        return res.status(200).json({
            message: 'Admin Deleted Successfully'
        });
    }
    catch (error) {
        console.error("Error in Removing Admin:", error);
        return res.status(500).json({
            error: "Error in Removing Admin"
        });
    }
}));
router.post('/add-subadmin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const detail = yield req.body;
        const zodResult = schema_1.AddSubAdminSchema.safeParse(detail);
        if (!zodResult.success) {
            return res.status(401).json({
                error: 'InValid Credentials'
            });
        }
        const response = yield prisma.subAdmin.findFirst({
            where: {
                id: detail.email
            }
        });
        if (response) {
            return res.status(401).json({
                error: "Sub-Admin Already Exists"
            });
        }
        yield prisma.subAdmin.create({
            data: {
                fullname: detail.fullname,
                email: detail.email,
                pin: detail.pin,
            }
        });
        return res.status(200).json({
            message: 'Sub-Admin Added Successfully'
        });
    }
    catch (error) {
        console.error("Error in Adding Sub-Admin:", error);
        return res.status(500).json({
            error: "Error in Adding Sub-Admin"
        });
    }
}));
router.post('/remove-subadmin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { removeId } = yield req.body;
        const response = yield prisma.subAdmin.findFirst({
            where: {
                id: removeId
            }
        });
        if (!response) {
            return res.status(401).json({
                error: 'Sub Admin Does Not Exists'
            });
        }
        yield prisma.subAdmin.delete({
            where: {
                id: removeId,
                email: response.email
            }
        });
        return res.status(200).json({
            message: 'Sub Admin Removed'
        });
    }
    catch (error) {
        console.error("Error in Removing Sub-Admin:", error);
        return res.status(500).json({
            error: "Error in Removing Sub-Admin"
        });
    }
}));
router.post('/add-doctor', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const details = yield req.body;
        const zodResult = schema_1.doctorSchema.safeParse(details);
        if (!zodResult.success) {
            console.log(zodResult.error);
            return res.status(400).json({
                error: "Invalid Request",
            });
        }
        const response = yield prisma.doctor.findFirst({
            where: {
                email: details.email
            }
        });
        if (response) {
            return res.status(401).json({
                "error": "Doctor Already Exists"
            });
        }
        const subAdmin = yield prisma.subAdmin.findFirst({
            where: {
                email: details.admin
            }
        });
        if (!subAdmin) {
            yield prisma.subAdmin.create({
                data: {
                    email: details.admin,
                    pin: '000000',
                    fullname: details.adminName
                }
            });
        }
        const findSubAdmin = yield prisma.subAdmin.findFirst({
            where: {
                email: details.admin
            }
        });
        const doctor = yield prisma.doctor.create({
            data: {
                fullname: details.fullname,
                email: details.email,
                specializations: details.specializations,
                hospitals: details.hospitals,
                about: details.about,
                admin: findSubAdmin === null || findSubAdmin === void 0 ? void 0 : findSubAdmin.id,
                rating: details.rating,
                phoneNumber: details.phoneNumber,
                address: details.address,
                latitude: details.latitude,
                longitude: details.longitude
            }
        });
        yield prisma.subAdmin.update({
            where: {
                id: findSubAdmin === null || findSubAdmin === void 0 ? void 0 : findSubAdmin.id,
            },
            data: {
                doctors: {
                    push: doctor.id,
                },
            },
        });
        return res.status(200).json({
            message: 'Doctor Added Successfully'
        });
    }
    catch (error) {
        console.error("Error in Adding Doctor:", error);
        return res.status(500).json({
            error: "Error in Adding Doctor"
        });
    }
}));
router.post('/remove-doctor', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { removeId } = yield req.body;
        const response = yield prisma.doctor.findFirst({
            where: {
                id: removeId
            }
        });
        if (!response || response.admin === null) {
            return res.status(401).json({
                error: 'Doctor Does Not Exist'
            });
        }
        const subAdmin = yield prisma.subAdmin.findFirst({
            where: {
                id: response.admin
            },
            select: {
                doctors: true,
            },
        });
        if (!subAdmin) {
            throw new Error("SubAdmin not found");
        }
        const updatedDoctors = subAdmin.doctors.filter((doctor) => doctor !== response.email);
        yield prisma.subAdmin.update({
            where: {
                id: response.admin
            },
            data: {
                doctors: {
                    set: updatedDoctors,
                },
            },
        });
        yield prisma.doctor.delete({
            where: {
                id: removeId,
                email: response.email
            }
        });
        return res.status(200).json({
            message: 'Doctor Removed Successfully'
        });
    }
    catch (error) {
        console.error("Error in Removing Doctor:", error);
        return res.status(500).json({
            error: "Error in Removing Doctor"
        });
    }
}));
router.post('/logout', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie('Admin');
        res.clearCookie('subAdmin');
        return res.status(200).json({
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
exports.adminRoute = router;
