import { useState, type SyntheticEvent } from "react"

import { BookUser, BookLock } from "lucide-react"
// import LoadingSpinner from "../components/layout/LoadingSpinner";
import { z } from "zod";
// import { toast } from "sonner";

import styles from "./RegisterPage.module.css"
import Button from "../components/elements/Button";

const RegistrationSchema = z.object({
    firstName: z.string()
                .trim()
                .min(2, "Must be at least 2 characters")
                .max(100, "Too long"),
    lastName: z.string()
                .trim()
                .min(2, "Must be at least 2 characters")
                .max(100, "Too long"),
    phone: z.e164("Must start with a country code prefixed with + and contain only numbers").trim(),
    email: z.email(),
    dateOfBirth: z.string(),
    nationalIdentityNumber: z.string()
                            .trim()
                            .min(11, "Must be at least 11 digists")
                            .max(11, "Cannot be longer than 11 digits"),
    password: z.string().trim()

})

export default function RegisterPage() {
    
    const [validationErrors, setValidationErrors ] = useState<string[] | null>(null);
    const [inputsWithError, setInputsWithError] = useState<string[]>([]);

    // const [backendError, setBackendError] = useState<string | null>(null);

    const handleSubmit = async(e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setValidationErrors(null)
        setInputsWithError([])
        const formData = new FormData(e.currentTarget);
        
        console.log(Object.fromEntries(formData))

        const validation = RegistrationSchema.safeParse(Object.fromEntries(formData));

        if(!validation.success) {
            setValidationErrors(validation.error.issues.map(err => `${err.path}: ${err.message} `))
            setInputsWithError(validation.error.issues.map(err => String(err.path[0])))
            return
        }

        // Create a patient, errors are caught in the catch block
    
        // toast.promise(createAppointment({
        //     firstName: firstname,
        //     lastName: lastname,
        //     phone,
        //     email,
        //     dateOfBirth,
        //     nationalIdentityNumber,
        //     password,
        //     isRegistered: true
        // }), {
        //     loading: "Registering...",
        //     success: () => {
        //         clearInputs();
        //         return "Registration successful!"
        //     },
        //     error: (err) => {
        //         console.log("Something went wrong during registration", err)
        //         setBackendError(err.message)
        //         return "Registration failed"
        //     }
        // })

    }

    return (
    <>
    <h1>Registration page</h1>
    <form onSubmit={handleSubmit} className={styles.formLayout}>
        <div className={styles.layout}>

            <div className={styles.personalDetails}>
                <div className={styles.icon}>
                    <BookUser />
                </div>
                <label>
                    Enter your first name
                    <input 
                        required
                        type="text"
                        name="firstName"
                        className={inputsWithError.includes("firstName") ? styles.errorInput : ""}
                        />
                </label>
                <label>
                    Enter your last name
                    <input 
                        required
                        type="text"
                        name="lastName"
                        className={inputsWithError.includes("lastName") ? styles.errorInput : ""}
                        />
                </label>
                <label>
                    Enter your phone number
                    <input 
                        type="tel"
                        name="phone"
                        placeholder="+4746200264"
                        className={inputsWithError.includes("phone") ? styles.errorInput : ""}
                        />
                </label>
                <label>
                    Enter your date of birth
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
                    Enter your email
                    <input 
                        required
                        type="email"
                        name="email"
                        placeholder="example@domain.com"
                        className={inputsWithError.includes("email") ? styles.errorInput : ""}
                        />
                </label>
                <label>
                    Enter your National Identity Number
                    <input 
                        required
                        type="text"
                        name="nationalIdentityNumber"
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
                {/* <Button type="submit" disabled={loadingAppointment || loadingPatient} >{loadingPatient || loadingAppointment ? (<LoadingSpinner />):"Register"}</Button> */}
            
            </div>
        </div>
        <Button type="submit">Register</Button>
        
        
        <div className={styles.messages}>

            {validationErrors && validationErrors.length > 0 && (
                    validationErrors.map((error => (
                        <p style={{ color: "red" }}>{error}</p>
                    )))
                )
            }

            {/* {backendError && <p style={{ color: "red" }}>{backendError}</p>} */}

            {/* {success && <p style={{ color: "green" }}>Registration successful</p>} */}
        </div>
    </form>
    </>
    )
}