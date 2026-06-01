import { z } from "zod";

export const AppointmentSchema = z.object({
    firstname: z.string().min(2, "First name is too short"),
    lastname: z.string().min(2, "Last name is too short"),
    dateOfBirth: z.string().min(1, "Please provide your date of birth"),
    phone: z.string().trim().regex(/^\d{8}$/, "Valid norwegian phone number is required (8 digits)"),
    DoctorId: z.string().min(1, "Please select a doctor"),
    CategoryId: z.string().min(1, "Please select a category"),
    AppointmentDate: z.string("Please select an appointment date and time"),
    Duration: z.string().min(1, "Please select a duration"),
    Note: z.string().optional()
});