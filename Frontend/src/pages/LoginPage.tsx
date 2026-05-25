import { type ChangeEvent } from "react";
import { useLoginStore } from "../stores/useLoginStore";
import { toast } from "sonner"
import { useNavigate } from "react-router";
import LoginForm from "../components/forms/LoginForm";

import styles from "./LoginPage.module.css"

import SideCard from "../components/elements/SideCard";

export default function LoginPage() {

    const navigate = useNavigate();

    const { loginPatient} = useLoginStore();

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
                <LoginForm submitHandler={handleSubmit} />
            </div>
}