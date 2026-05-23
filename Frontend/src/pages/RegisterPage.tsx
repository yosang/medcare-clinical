import { useEffect, useRef, useState, type SyntheticEvent } from "react"

import { BookUser, BookLock } from "lucide-react"
import LoadingSpinner from "../components/layout/LoadingSpinner";
import { z } from "zod";
import { toast } from "sonner";

import styles from "./RegisterPage.module.css"
import Button from "../components/elements/Button";
import { useRegistrationStore } from "../stores/useRegistrationStore";

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

    return (
    <>
    <form onSubmit={handleSubmit} className={styles.formLayout} ref={formRef}>
        <div className={styles.layout}>

            <div className={styles.personalDetails}>
                <div className={styles.icon}>
                    <BookUser />
                </div>
                <label>
                    Firstname
                    <input 
                        ref={inputRef}
                        required
                        type="text"
                        name="firstName"
                        placeholder="John"
                        className={inputsWithError.includes("firstName") ? styles.errorInput : ""}
                        />
                </label>
                <label>
                    Lastname
                    <input 
                        required
                        type="text"
                        name="lastName"
                        placeholder="Doe"
                        className={inputsWithError.includes("lastName") ? styles.errorInput : ""}
                        />
                </label>
                <label>
                    Phone number
                    <input 
                        type="tel"
                        name="phone"
                        placeholder="462 00 264"
                        className={inputsWithError.includes("phone") ? styles.errorInput : ""}
                        />
                </label>
                <label>
                    Date of birth
                    <input 
                        required
                        type="date"
                        name="dateOfBirth"
                        className={inputsWithError.includes("dateOfBirth") ? styles.errorInput : ""}
                        />
                </label>
            </div>


            <div className={styles.sensitiveDetails}>
                <div className={styles.icon}>
                    <BookLock />
                </div>
                <label>
                    Email
                    <input 
                        required
                        type="email"
                        name="email"
                        placeholder="example@domain.com"
                        className={inputsWithError.includes("email") ? styles.errorInput : ""}
                        />
                </label>
                <label>
                    National Identity Number
                    <input 
                        required
                        type="text"
                        name="nationalIdentityNumber"
                        placeholder="DDMMÅÅXXXXX"
                        className={inputsWithError.includes("nationalIdentityNumber") ? styles.errorInput : ""}
                        />
                </label>
                <label>
                    Enter a password
                    <input 
                        required
                        type="password"
                        name="password"
                        className={inputsWithError.includes("password") ? styles.errorInput : ""}
                        />
                </label>
            
                <Button type="submit" disabled={loading} >{loading ? (<LoadingSpinner />):"Register"}</Button>
            </div>
        </div>
        
        
        <div className={styles.messages}>

            {validationErrors && validationErrors.length > 0 && (
                    validationErrors.map((error => (
                        <p style={{ color: "red" }}>{error}</p>
                    )))
                )
            }

            {backendError && <p style={{ color: "red" }}>{backendError}</p>}
        </div>
    </form>
    </>
    )
}