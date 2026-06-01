import { forwardRef, type Ref, type SyntheticEvent } from "react";

import Button from "../elements/Button";
import DateInput from "../formElements/DateInput";
import EmailInput from "../formElements/EmailInput";
import PasswordInput from "../formElements/PasswordInput";
import TextInput from "../formElements/TextInput";
import LoadingSpinner from "../layout/LoadingSpinner";

import styles from "./styles/RegistrationForm.module.css"

import { useValidationStore } from "../../stores/useValidationStore";
import { useShallow } from "zustand/shallow";
import type { useRegisterPatient } from "../../queries/usePatients";

type Props = { 
    submitHandler: (e: SyntheticEvent<HTMLFormElement>) => void
    mutation: ReturnType<typeof useRegisterPatient>
}

const RegistrationForm = forwardRef(({ submitHandler, mutation}:Props, ref: Ref<HTMLFormElement>) => {

    const { validationErrors, errorIdentifier } = useValidationStore(useShallow(s => ({
        validationErrors: s.validationErrors,
        errorIdentifier: s.errorIdentifier
    })));

    return <form onSubmit={submitHandler} className={styles.formLayout} ref={ref}>
                <div className={styles.header}>
                    <h2>Create an account</h2>
                    <p style={{ color: "var(--color-muted)" }} >Enter your details to register as a new patient</p>
                </div>
                <div className={styles.inputs}>
                    <div className={styles.personalDetails}>
                        <TextInput
                            labelText="Firstname"
                            name="firstName"
                            placeholder="John"
                            aria-invalid={errorIdentifier("firstName")}
                            style={errorIdentifier("firstName") ? { border: "1px solid red"}:{}}
                        />
                        <TextInput 
                            labelText="Lastname"
                            name="lastName"
                            placeholder="Doe"
                            aria-invalid={errorIdentifier("lastName")}
                            style={errorIdentifier("lastName") ? { border: "1px solid red"}:{}}
                        />
                        <TextInput 
                            labelText="Phone number"
                            name="phone"
                            placeholder="462 00 264"
                            style={errorIdentifier("phone") ? { border: "1px solid red"}:{}}
                            />
                        <DateInput 
                            labelText="Date of birth"
                            name="dateOfBirth"
                            aria-invalid={errorIdentifier("dateOfBirth")}
                            style={errorIdentifier("dateOfBirth") ? { border: "1px solid red"}:{}}
                        />
                    </div>
                    <div className={styles.sensitiveDetails}>
                        <EmailInput 
                            labelText="Email"
                            name="email"
                            placeholder="example@domain.com"
                            aria-invalid={errorIdentifier("email")}
                            style={errorIdentifier("email") ? { border: "1px solid red"}:{}}
                            />

                        <TextInput 
                            labelText="National Identity Number"
                            name="nationalIdentityNumber"
                            placeholder="DDMMÅÅXXXXX"
                            aria-invalid={errorIdentifier("nationalIdentityNumber")}
                            style={errorIdentifier("nationalIdentityNumber") ? { border: "1px solid red"}:{}}
                            />
                        <PasswordInput 
                            labelText="Password"
                            name="password"
                            aria-invalid={errorIdentifier("password")}
                            style={errorIdentifier("password") ? { border: "1px solid red"}:{}}
                        />
                    </div>
                </div>
            <div className={styles.messages}>
                {validationErrors && validationErrors.length > 0 && (
                    validationErrors.map((error => (
                        <p style={{ color: "red" }}>{error}</p>
                        )))
                    )
                }

                {mutation.error && <p style={{ color: "red" }}>{mutation.error.message}</p>}
            </div>

            <Button type="submit" disabled={mutation.isPending} >{mutation.isPending ? (<LoadingSpinner />):"Register"}</Button>
        </form>
})

export default RegistrationForm;