import { z } from "zod";

export const RegistrationSchema = z.object({
    firstName: z.string()
                .trim()
                .min(2, "First name must be at least 2 characters")
                .max(100, "First name is too long"),
    lastName: z.string()
                .trim()
                .min(2, "Last name must be at least 2 characters")
                .max(100, "Last name is oo long"),
    phone: z.string().trim().regex(/^\d{8}$/, "Phone number must be exactly 8 digits"),
    email: z.email(),
    dateOfBirth: z.string(),
    nationalIdentityNumber: z.string()
                            .trim()
                            .min(11, "National Identity Number must be at least 11 digists")
                            .max(11, "National Identity Number cannot be longer than 11 digits"),
    password: z.string().trim()

})