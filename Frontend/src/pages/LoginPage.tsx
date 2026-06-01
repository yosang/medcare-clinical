import { lazy, Suspense, useState, type ChangeEvent } from "react";
import { useLoginStore } from "../stores/useLoginStore";
import { toast } from "sonner"
import { useLocation, useNavigate } from "react-router";

import styles from "./styles/LoginPage.module.css"

import SideCard from "../components/elements/SideCard";
import LoginSkeleton from "../components/skeletons/LoginSkeleton";

// lazy loaded
const LoginForm = lazy(() => import("../components/forms/LoginForm"))

export default function LoginPage() {

    const navigate = useNavigate();
    
    // local states
    const location = useLocation();
    const { email: passedFromRegistration } = location.state || {};
    
    const [form, setForm] = useState({
        email: passedFromRegistration || "",
        password: ""
    })

    // Zustand states
    const loginPatient = useLoginStore((s) => s.loginPatient);

    // handlers
    const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();

        toast.promise(loginPatient({
            email: form.email,
            password: form.password
        }), {
            loading: "Logging you in...",
            success: () => {
                navigate("/book")
                return "Logged in!"
            },
            error: (err) => {
                console.log("Something went wrong during login", err)
                return "Failed to log in."
            }
        })
    }
    
    return <div className={styles.mainLayout}>
                <SideCard 
                    imageLink="https://i.imgur.com/QckLTs9.jpeg"
                    headerText="MedCare Clinical"
                    contentText="Access, manage and review your clinical appointments with ease."
                    footerText="Secure Healthcare Certified"
                />
                <Suspense fallback={<LoginSkeleton />}>
                    <LoginForm submitHandler={handleSubmit} formData={form} formSetter={setForm}/>
                </Suspense>
            </div>
}