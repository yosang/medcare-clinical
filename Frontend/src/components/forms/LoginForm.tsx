import { useEffect, useRef, type ChangeEvent } from "react";
import { useLoginStore } from "../../stores/useLoginStore";

import styles from "./LoginForm.module.css"

import Button from "../elements/Button";
import LoadingSpinner from "../layout/LoadingSpinner";
import EmailInput from "../formElements/EmailInput";
import PasswordInput from "../formElements/PasswordInput";
import { useShallow } from "zustand/shallow";

export default function LoginForm({ submitHandler }:{ submitHandler: (e: ChangeEvent<HTMLFormElement>) => void }) {

    // Zustands tates
    const { loading, error, errorMessage } = useLoginStore(useShallow(s => ({
        loading: s.loading,
        error: s.error,
        errorMessage: s.errorMessage
    })));
    
    // refs
    const emailref = useRef<HTMLInputElement | null>(null);

    // effects
    useEffect(() => {
        emailref.current?.focus();
    }, [])

    return <form onSubmit={submitHandler} className={styles.layout}>
            <div className={styles.loginCard}>
                <div className={styles.loginInputs}>
                    <div className={styles.loginHeader}>
                        <h2>Welcome back</h2>
                        <p style={{ color: "var(--text-muted"}}>Please enter your credentials to continue</p>
                    </div>
                    <EmailInput name={"email"} ref={emailref} labelText="Email" />
                    <PasswordInput name="password" labelText="Password"/>
                    <Button type="submit" disabled={loading} >{loading ? (<LoadingSpinner />):"Login"}</Button>
                    <p style={{ color: "var(--text-muted"}}>Dont have an account? <a style={{ color: "var(--brand-primary)", textDecoration: "none" }} href="/register">Register</a></p>
                    {error && <p style={{ color: "red", padding: "var(--spacing-md)" }}>{errorMessage}</p>}
                </div>
            </div>
        </form>
}