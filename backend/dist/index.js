"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const patient_1 = require("./routes/patient");
const appointment_1 = require("./routes/appointment");
const admin_1 = require("./routes/admin");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const doctor_1 = require("./routes/doctor");
const subAdmin_1 = require("./routes/subAdmin");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// app.use(cors());
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173', // Your frontend URL
    credentials: true, // Allow credentials (cookies, headers)
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use('/api/v1/patient', patient_1.patientRoute);
app.use('/api/v1/appointment', appointment_1.appointmentRoute);
app.use('/api/v1/admin', admin_1.adminRoute);
app.use('/api/v1/doctor', doctor_1.doctortRoute);
app.use('/api/v1/subAdmin', subAdmin_1.subAdminRouter);
app.listen(PORT);
