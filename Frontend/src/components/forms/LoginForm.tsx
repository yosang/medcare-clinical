import { useEffect, useRef, type ChangeEvent } from "react";
import { useLoginStore } from "../../stores/useLoginStore";

import styles from "./LoginForm.module.css"

import Button from "../elements/Button";
import LoadingSpinner from "../layout/LoadingSpinner";
import EmailInput from "../formElements/EmailInput";
import PasswordInput from "../formElements/PasswordInput";
import { useShallow } from "zustand/shallow";
import { useLocation } from "react-router";

export default function LoginForm({ submitHandler }:{ submitHandler: (e: ChangeEvent<HTMLFormElement>) => void }) {

    const location = useLocation();
    const { email } = location.state || {};

    // Zustands tates
    const { loading, error, errorMessage, clearErrors } = useLoginStore(useShallow(s => ({
        loading: s.loading,
        error: s.error,
        errorMessage: s.errorMessage,
        clearErrors: s.clearErrors
    })));
    
    // refs
    const emailRef = useRef<HTMLInputElement | null>(null);
    const passwordRef = useRef<HTMLInputElement | null>(null);

    // effects
    useEffect(() => {
        if(email) {
            passwordRef.current?.focus();
        } else {
            emailRef.current?.focus();
        }
        
        clearErrors();
    }, [])

    return <form onSubmit={submitHandler} className={styles.layout}>
            <div className={styles.loginCard}>
                <div className={styles.loginInputs}>
                    <div className={styles.loginHeader}>
                        <h2>Welcome back</h2>
                        <p style={{ color: "var(--text-muted"}}>Please enter your credentials to continue</p>
                    </div>
                    <EmailInput name={"email"} ref={emailRef} labelText="Email" value={email ? email:""} />
                    <PasswordInput name="password" ref={passwordRef} labelText="Password"/>
                    <Button type="submit" disabled={loading} >{loading ? (<LoadingSpinner />):"Login"}</Button>
                    <p style={{ color: "var(--text-muted"}}>Dont have an account? <a style={{ color: "var(--brand-primary)", textDecoration: "none" }} href="/register">Register</a></p>
                    {error && <p style={{ color: "red", padding: "var(--spacing-md)" }}>{errorMessage}</p>}
                </div>
            </div>
        </form>
}