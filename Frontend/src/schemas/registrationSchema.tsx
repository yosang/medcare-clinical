import { z } from "zod";

export const RegistrationSchema = z.object({
    firstName: z.string()
                .trim()
                .min(2, "Must be at least 2 characters")
                .max(100, "Too long"),
    lastName: z.string()
                .trim()
                .min(2, "Must be at least 2 characters")
                .max(100, "Too long"),
    phone: z.string().trim().regex(/^\d{8}$/, "Phone number must be exactly 8 digits"),
    email: z.email(),
    dateOfBirth: z.string(),
    nationalIdentityNumber: z.string()
                            .trim()
                            .min(11, "Must be at least 11 digists")
                            .max(11, "Cannot be longer than 11 digits"),
    password: z.string().trim()

})