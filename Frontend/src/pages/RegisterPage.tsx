import { lazy, Suspense, type SyntheticEvent } from "react"

import { toast } from "sonner";

import styles from "./styles/RegisterPage.module.css"

import { RegistrationSchema } from "../schemas/registrationSchema";
import { useValidationStore } from "../stores/useValidationStore";

import SideCard from "../components/elements/SideCard";
import { useShallow } from "zustand/shallow";
import RegistrationSkeleton from "../components/skeletons/RegistrationSkeleton";
import { useRegisterPatient } from "../queries/usePatients";
import { useNavigate } from "react-router";

// lazy loaded component
const RegistrationForm = lazy(() => import("../components/forms/RegistrationForm"))

export default function RegisterPage() {
    const navigate = useNavigate();

    // Tanstack mutations
    const registerMutation = useRegisterPatient();
    

    const { validate, clearErrors } = useValidationStore(useShallow(s => ({
        validate: s.validate,
        clearErrors: s.clearErrors
    })));

    // handlers
    const handleSubmit = async(e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        clearErrors();
        
        const formData = new FormData(e.currentTarget);
        
        const dataIsValid = validate(RegistrationSchema, Object.fromEntries(formData))
        if(!dataIsValid) return;

        toast.promise(registerMutation.mutateAsync({
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
                clearErrors();
                navigate("/login", { state: { email: formData.get("email")} }) // Navigates to the login page and sends the registered email to prefill the input
                return "Registration successful!"
            },
            error: () => {
                return "Registration failed"
            }
        })

    }

    return <div className={styles.mainLayout}>
                <SideCard 
                    imageLink="https://i.imgur.com/8WNM1hA.png"
                    headerText="Welcome to a new standard of health care"
                    contentText="Join MedCare Clinical Systems to manage your appointments with absolute privacy"
                    footerText="Secure Data Encryption"
                />
                
                <Suspense fallback={<RegistrationSkeleton />}>
                    <RegistrationForm submitHandler={handleSubmit} mutation={registerMutation}/>
                </Suspense>
            </div>
}