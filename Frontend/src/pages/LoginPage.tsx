import type { ChangeEvent } from "react";
import Button from "../components/elements/Button";
import styles from "./LoginPage.module.css"

export default function LoginPage() {

    const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget)
        console.log(formData)
    }

    return <form onSubmit={handleSubmit} className={styles.layout}>
            <div className={styles.loginCard}>
                <div className={styles.loginInputs}>

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
                    <Button type="submit" >Login</Button>
                </div>
            </div>
        </form>
}