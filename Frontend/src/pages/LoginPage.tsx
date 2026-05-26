import { lazy, Suspense, type ChangeEvent } from "react";
import { useLoginStore } from "../stores/useLoginStore";
import { toast } from "sonner"
import { useNavigate } from "react-router";

import styles from "./LoginPage.module.css"

import SideCard from "../components/elements/SideCard";
import LoginSkeleton from "../components/skeletons/LoginSkeleton";

// lazy loaded
const LoginForm = lazy(() => import("../components/forms/LoginForm"))

export default function LoginPage() {

    // Zustand states
    const navigate = useNavigate();
    const loginPatient = useLoginStore((s) => s.loginPatient);

    // handlers
    const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget)

        toast.promise(loginPatient({
            email: String(formData.get("email")),
            password: String(formData.get("password"))
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
                    <LoginForm submitHandler={handleSubmit} />
                </Suspense>
            </div>
}