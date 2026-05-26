import { forwardRef, type Ref, type SyntheticEvent } from "react";
import Button from "../elements/Button";
import DateInput from "../formElements/DateInput";
import EmailInput from "../formElements/EmailInput";
import PasswordInput from "../formElements/PasswordInput";
import TextInput from "../formElements/TextInput";
import LoadingSpinner from "../layout/LoadingSpinner";

import styles from "./RegistrationForm.module.css"
import { useValidationStore } from "../../stores/useValidationStore";
import { useRegistrationStore } from "../../stores/useRegistrationStore";

type Props = { 
    submitHandler: (e: SyntheticEvent<HTMLFormElement>) => void
}

const RegistrationForm = forwardRef(({ submitHandler, }:Props, ref: Ref<HTMLFormElement>) => {

    const { loading,  errorMessage } = useRegistrationStore();
    const { validationErrors, inputsWithErrors } = useValidationStore();

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
                            style={inputsWithErrors.includes("firstName") ? { border: "1px solid red"}:{}}
                        />
                        <TextInput 
                            labelText="Lastname"
                            name="lastName"
                            placeholder="Doe"
                            style={inputsWithErrors.includes("lastName") ? { border: "1px solid red"}:{}}
                        />
                        <TextInput 
                            labelText="Phone number"
                            name="phone"
                            placeholder="462 00 264"
                            style={inputsWithErrors.includes("phone") ? { border: "1px solid red"}:{}}
                            />
                        <DateInput 
                            labelText="Date of birth"
                            name="dateOfBirth"
                            style={inputsWithErrors.includes("dateOfBirth") ? { border: "1px solid red"}:{}}
                        />
                    </div>
                    <div className={styles.sensitiveDetails}>
                        <EmailInput 
                            labelText="Email"
                            name="email"
                            placeholder="example@domain.com"
                            style={inputsWithErrors.includes("email") ? { border: "1px solid red"}:{}}
                            />

                        <TextInput 
                            labelText="National Identity Number"
                            name="nationalIdentityNumber"
                            placeholder="DDMMÅÅXXXXX"
                            style={inputsWithErrors.includes("nationalIdentityNumber") ? { border: "1px solid red"}:{}}
                            />
                        <PasswordInput 
                            labelText="Password"
                            name="password"
                            style={inputsWithErrors.includes("password") ? { border: "1px solid red"}:{}}
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

                {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            </div>

            <Button type="submit" disabled={loading} >{loading ? (<LoadingSpinner />):"Register"}</Button>
        </form>
})

export default RegistrationForm;