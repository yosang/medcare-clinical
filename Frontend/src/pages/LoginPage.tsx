import { type ChangeEvent } from "react";
import { useLoginStore } from "../stores/useLoginStore";
import { toast } from "sonner"
import { useNavigate } from "react-router";
import LoginForm from "../components/forms/LoginForm";

import styles from "./LoginPage.module.css"

import { ShieldCheck } from "lucide-react";

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
                <div className={styles.sideCard}>
                    <div className={styles.text}>
                        <h2>MedCare Clinical</h2>
                        <p>Access, manage and review your clinical appointments with ease.</p>
                        <p><ShieldCheck />Secure Healthcare Certified</p>
                    </div>
                    <img src="https://i.imgur.com/8WNM1hA.png" alt="Medical Room Image"/>
                </div>
                <div className={styles.loginCard}>
                    <LoginForm submitHandler={handleSubmit} />
                </div>
            </div>
}