import { z } from "zod";

export const PatientSchema = z.object({
    firstname: z.string()
                .trim()
                .min(2, "Firstname must be at least 2 characters")
                .max(100, "Firstname is too long"),
    lastname: z.string()
                .trim()
                .min(2, "Lastname must be at least 2 characters")
                .max(100, "Lastname is too long"),
    phone: z.string().trim()
                .regex(/^\d{8}$/, "Phone number must be exactly 8 digits and only consist of numberic digits")

})