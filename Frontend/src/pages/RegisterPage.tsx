import { useEffect, useRef, type SyntheticEvent } from "react"

import { toast } from "sonner";

import styles from "./RegisterPage.module.css"

import { useRegistrationStore } from "../stores/useRegistrationStore";
import { RegistrationSchema } from "../schemas/registrationSchema";
import { useValidationStore } from "../stores/useValidationStore";

import RegistrationForm from "../components/forms/RegistrationForm";
import SideCard from "../components/elements/SideCard";


export default function RegisterPage() {
    
    const inputRef = useRef<HTMLInputElement | null>(null);
    const formRef = useRef<HTMLFormElement | null>(null);

    const { registerPatient, clearErrors: clearBackendErrors } = useRegistrationStore();
    const { validate, clearErrors } = useValidationStore();

    const handleSubmit = async(e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        clearErrors();
        clearBackendErrors();
        
        const formData = new FormData(e.currentTarget);
        
        validate(RegistrationSchema, Object.fromEntries(formData))

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
            loading: "Creating account...",
            success: () => {
                formRef.current?.reset();
                clearErrors();
                clearBackendErrors();
                return "Registration successful!"
            },
            error: (err) => {
                console.log("Something went wrong during registration", err)
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
                
                <RegistrationForm submitHandler={handleSubmit} />
            </div>
}