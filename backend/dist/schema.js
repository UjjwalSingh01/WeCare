"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddSubAdminSchema = exports.AddAdminSchema = exports.doctorSchema = exports.appointmentSchema = exports.patientSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
const registerSchema = zod_1.z.object({
    email: zod_1.z.string().email('Enter Correct Email Format'),
    fullname: zod_1.z.string().min(2, 'Name Must Contain Atleast 2 Characters'),
    phoneNumber: zod_1.z.string().length(10, 'Phone Number Must Contain Only 10 digits')
    // phoneNumber :z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),
});
exports.registerSchema = registerSchema;
const patientSchema = zod_1.z.object({
    email: zod_1.z.string().email('Enter Correct Email Format'),
    fullname: zod_1.z.string().min(2, 'Name Must Contain Atleast 2 Characters'),
    // phoneNumber :z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),
    phoneNumber: zod_1.z.string().length(10, 'Phone Number Must Contain Only 10 digits'),
    dob: zod_1.z.string(),
    gender: zod_1.z.enum(['MALE', 'FEMALE', 'OTHER']),
    address: zod_1.z.string(),
    emergencyContactName: zod_1.z.string().optional(),
    emergenyPhone: zod_1.z.string().length(10, 'Phone Number Must Contain Only 10 digits'),
    // emergenyPhone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format").optional(),
    primaryPhysician: zod_1.z.string().optional(),
    allergies: zod_1.z.string().optional(),
    medications: zod_1.z.string().optional(),
    medicalHistory: zod_1.z.string().optional(),
    familyMedicalHistory: zod_1.z.string().optional()
});
exports.patientSchema = patientSchema;
const appointmentSchema = zod_1.z.object({
    physician: zod_1.z.string(),
    reason: zod_1.z.string(),
    note: zod_1.z.string().optional(),
    date: zod_1.z.string(),
    time: zod_1.z.string()
});
exports.appointmentSchema = appointmentSchema;
const doctorSchema = zod_1.z.object({
    fullname: zod_1.z.string().min(2, 'Name Must Contain Atleast 2 Characters'),
    email: zod_1.z.string().email('Enter Correct Email Format'),
    admin: zod_1.z.string().nonempty('Admin Must Be Added'),
    adminName: zod_1.z.string().min(2, 'Name Must Contain Atleast 2 Characters').nonempty('Admin Name is Required'),
    specializations: zod_1.z
        .array(zod_1.z.string().nonempty("Specialization cannot be an empty string."))
        .min(1, "At least one specialization is required."),
    hospitals: zod_1.z
        .array(zod_1.z.string().nonempty("Hospital cannot be an empty string."))
        .min(1, "At least one hospital is required."),
    about: zod_1.z.string().nonempty("About section is required."),
    rating: zod_1.z
        .number()
        .min(1, { message: "Rating must be at least 1." })
        .max(5, { message: "Rating must be at most 5." }),
    phoneNumber: zod_1.z
        .array(zod_1.z.string().nonempty("Phone Number cannot be an empty string."))
        .min(1, "At least one Phone Number is required."),
    address: zod_1.z.string(),
    latitude: zod_1.z.number(),
    longitude: zod_1.z.number()
});
exports.doctorSchema = doctorSchema;
const AddAdminSchema = zod_1.z.object({
    fullname: zod_1.z.string().min(2, 'Name Must Contain Atleast 2 Characters'),
    email: zod_1.z.string().email('Enter Correct Email Format'),
    pin: zod_1.z.string().length(6, 'Pin must be exactly 6 digits').regex(/^\d{6}$/, 'Pin must only contain digits'),
    removeFacility: zod_1.z.boolean(),
});
exports.AddAdminSchema = AddAdminSchema;
const AddSubAdminSchema = zod_1.z.object({
    fullname: zod_1.z.string().min(2, 'Name Must Contain Atleast 2 Characters'),
    email: zod_1.z.string().email('Enter Correct Email Format'),
    pin: zod_1.z.string().length(6, 'Pin must be exactly 6 digits').regex(/^\d{6}$/, 'Pin must only contain digits'),
});
exports.AddSubAdminSchema = AddSubAdminSchema;
