import { useEffect, useRef, useState, type SyntheticEvent } from "react"

import { z } from "zod";
import { toast } from "sonner";

import styles from "./RegisterPage.module.css"

import { useRegistrationStore } from "../stores/useRegistrationStore";
import RegistrationForm from "../components/forms/RegistrationForm";
import SideCard from "../components/elements/SideCard";

const RegistrationSchema = z.object({
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

export default function RegisterPage() {
    
    const inputRef = useRef<HTMLInputElement | null>(null);
    const formRef = useRef<HTMLFormElement | null>(null);
    const { loading,  registerPatient } = useRegistrationStore();
    const [validationErrors, setValidationErrors ] = useState<string[] | null>(null);
    const [inputsWithError, setInputsWithError] = useState<string[]>([]);

    const [backendError, setBackendError] = useState<string | null>(null);

    const handleSubmit = async(e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setValidationErrors(null)
        setInputsWithError([])
        setBackendError(null)
        const formData = new FormData(e.currentTarget);
        
        const validation = RegistrationSchema.safeParse(Object.fromEntries(formData));

        if(!validation.success) {
            setValidationErrors(validation.error.issues.map(err => `${err.path}: ${err.message} `))
            setInputsWithError(validation.error.issues.map(err => String(err.path[0])))
            return
        }

        toast.promise(registerPatient({
            firstName: String(formData.get("firstName")),
            lastName: String(formData.get("lastName")),
            phone: String(formData.get("phone")),
            email: String(formData.get("email")),
            dateOfBirth: String(formData.get("dateOfBirth")),
            nationalIdentityNumber: String(formData.get("nationalIdentityNumber")),
            password: String(formData.get("password")),
            isRegistered: true
        }), {
            position: "top-center",
            loading: "Registering...",
            success: () => {
                formRef.current?.reset();
                return "Registration successful!"
            },
            error: (err) => {
                console.log("Something went wrong during registration", err)
                setBackendError(err.message)
                return "Registration failed"
            }
        })

    }

    useEffect(() => {
        inputRef.current?.focus();
    }, [])

    return <div className={styles.mainLayout}>
                <SideCard 
                    imageLink="https://i.imgur.com/8WNM1hA.png"
                    headerText="Welcome to a new standard of health care"
                    contentText="Join MedCare Clinical Systems to manage your appointments with absolute privacy"
                    footerText="Secure Data Encryption"
                />
                
                <RegistrationForm
                    submitHandler={handleSubmit}
                    validationErrors={validationErrors}
                    backendError={backendError}
                    loading={loading} 
                    errors={inputsWithError} />
            </div>
}