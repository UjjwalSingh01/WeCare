import { Gender } from '@prisma/client'
import { z } from 'zod'

const registerSchema = z.object({
    email: z.string().email('Enter Correct Email Format'),
    fullname: z.string().min(2, 'Name Must Contain Atleast 2 Characters'),
    phoneNumber :z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),
})

type registerType = z.infer<typeof registerSchema>


const patientSchema = z.object({
    email: z.string().email('Enter Correct Email Format'),
    fullname: z.string().min(2, 'Name Must Contain Atleast 2 Characters'),
    phoneNumber :z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),
    dob: z.string(),
    gender: z.enum(['Male', 'Female' , 'Other']),
    address: z.string(),
    emergencyContactName: z.string().optional(),
    emergenyPhone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format").optional(),
    primaryPhysician: z.string().optional(),
    allergies: z.string().optional(),
    medications: z.string().optional(),
    medicalHistory:z.string().optional(),
    familyMedicalHistory: z.string().optional()
})

type patientType = z.infer<typeof patientSchema>


const appointmentSchema = z.object({
    physician: z.string(),
    reason: z.string(),
    note: z.string().optional(),
    date: z.string(),
    time: z.string()
})

type appointmentType = z.infer<typeof appointmentSchema>

const doctorSchema = z.object({
    fullname: z.string().min(2, 'Name Must Contain Atleast 2 Characters'),
    email: z.string().email('Enter Correct Email Format'),
    admin: z.string().nonempty('Admin Must Be Added') ,
    adminName: z.string().min(2, 'Name Must Contain Atleast 2 Characters').nonempty('Admin Name is Required') ,
    specializations: z
        .array(z.string().nonempty("Specialization cannot be an empty string."))
        .min(1, "At least one specialization is required."),
  
    hospitals: z
        .array(z.string().nonempty("Hospital cannot be an empty string."))
        .min(1, "At least one hospital is required."),
  
    about: z.string().nonempty("About section is required."),
  
    rating: z
        .number()
        .min(1, { message: "Rating must be at least 1." })
        .max(5, { message: "Rating must be at most 5." })
});

type doctorType = z.infer<typeof doctorSchema>


const AddAdminSchema = z.object({
    fullname: z.string().min(2, 'Name Must Contain Atleast 2 Characters'),
    email: z.string().email('Enter Correct Email Format'),
    pin: z.string().length(6, 'Pin must be exactly 6 digits').regex(/^\d{6}$/, 'Pin must only contain digits'),
    removeFacility: z.boolean(),
})

type AddAdminType = z.infer<typeof AddAdminSchema>


const AddSubAdminSchema = z.object({
    fullname: z.string().min(2, 'Name Must Contain Atleast 2 Characters'),
    email: z.string().email('Enter Correct Email Format'),
    pin: z.string().length(6, 'Pin must be exactly 6 digits').regex(/^\d{6}$/, 'Pin must only contain digits'),
})

type AddSubAdminType = z.infer<typeof AddSubAdminSchema>


export {
    registerSchema,
    registerType,
    patientSchema,
    patientType,
    appointmentSchema,
    appointmentType,
    doctorSchema,
    doctorType,
    AddAdminSchema,
    AddAdminType,
    AddSubAdminSchema,
    AddSubAdminType,
}