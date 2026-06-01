import { useEffect, useRef, type ChangeEvent, type Dispatch, type SetStateAction } from "react";
import { useLoginStore } from "../../stores/useLoginStore";

import styles from "./styles/LoginForm.module.css"

import Button from "../elements/Button";
import LoadingSpinner from "../layout/LoadingSpinner";
import EmailInput from "../formElements/EmailInput";
import PasswordInput from "../formElements/PasswordInput";
import { useShallow } from "zustand/shallow";

interface FormPayload {
    email: string,
    password: string
}

type Props = { 
    submitHandler: (e: ChangeEvent<HTMLFormElement>) => void 
    formData: FormPayload
    formSetter: Dispatch<SetStateAction< FormPayload >>
}

export default function LoginForm({ submitHandler, formData, formSetter }:Props) {

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

    useEffect(() => {

        if(formData && formData.email) {
            passwordRef.current?.focus();
        }

        if(formData && !formData.email) {
            emailRef.current?.focus();
        }

        clearErrors();

        // Im disabling the next line because we want to specifically put focus only on first mount
        // eslint-disable-next-line
    }, [])

    return <form onSubmit={submitHandler} className={styles.layout}>
            <div className={styles.loginCard}>
                <div className={styles.loginInputs}>

                    <div className={styles.loginHeader}>
                        <h2>Welcome back</h2>
                        <p style={{ color: "var(--text-muted"}}>Please enter your credentials to continue</p>
                    </div>

                    <EmailInput 
                        ref={emailRef} 
                        labelText="Email" 
                        value={formData.email} 
                        aria-invalid={error}
                        onChange={(e) => formSetter(prev => ({...prev, email: e.target.value}))} 
                    />

                    <PasswordInput 
                        ref={passwordRef} 
                        labelText="Password"
                        value={formData.password} 
                        aria-invalid={error}
                        onChange={(e) => formSetter(prev => ({...prev, password: e.target.value}))}
                    />
                    
                    <Button 
                        type="submit" disabled={loading} 
                    >
                        {loading ? (<LoadingSpinner />):"Login"}
                    </Button>
                    
                    <p style={{ color: "var(--text-muted"}}>
                        Dont have an account? <a style={{ color: "var(--brand-primary)", textDecoration: "none" }} href="/register">Register</a>
                    </p>
                    
                    {error && <p style={{ color: "red", padding: "var(--spacing-md)" }}>{errorMessage}</p>}
                </div>
            </div>
        </form>
}