import type { ChangeEvent } from "react";
import Button from "../components/elements/Button";
import styles from "./LoginPage.module.css"
import { ScanFace } from "lucide-react";
import { useLoginStore } from "../stores/useLoginStore";
import { toast } from "sonner"
import LoadingSpinner from "../components/layout/LoadingSpinner";
import { useNavigate } from "react-router";

export default function LoginPage() {

    const navigate = useNavigate();

    const { loading, loginPatient } = useLoginStore();

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

                // Set a backend error
                return "Failed to log in."
            }
        })
    }

    return <form onSubmit={handleSubmit} className={styles.layout}>
            <div className={styles.loginCard}>
                <div className={styles.loginInputs}>
                <div className={styles.icon}>
                    <ScanFace />
                </div>
                    <label>
                        Email
                        <input 
                            required
                            name="email"
                            type="email"
                            />
                    </label>
                    <label>
                        Password
                        <input 
                            required
                            name="password"
                            type="password"
                            />
                    </label>
                    <Button type="submit" disabled={loading} >{loading ? (<LoadingSpinner />):"Login"}</Button>
                </div>
            </div>
        </form>
}