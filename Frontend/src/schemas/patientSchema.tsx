import { z } from "zod";

export const PatientSchema = z.object({
    firstname: z.string()
                .trim()
                .min(2, "First name must be at least 2 characters")
                .max(100, "First name is too long"),
    lastname: z.string()
                .trim()
                .min(2, "Last name must be at least 2 characters")
                .max(100, "Last name is too long"),
    phone: z.string().trim()
                .regex(/^\d{8}$/, "Phone number must be exactly 8 digits and only consist of numberic digits")

})