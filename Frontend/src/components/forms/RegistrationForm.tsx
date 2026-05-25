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
                            className={inputsWithErrors.includes("firstName") ? styles.errorInput : ""}
                        />
                        <TextInput 
                            labelText="Lastname"
                            name="lastName"
                            placeholder="Doe"
                            className={inputsWithErrors.includes("lastName") ? styles.errorInput : ""}
                        />
                        <TextInput 
                            labelText="Phone number"
                            name="phone"
                            placeholder="462 00 264"
                            className={inputsWithErrors.includes("phone") ? styles.errorInput : ""}
                            />
                        <DateInput 
                            labelText="Date of birth"
                            name="dateOfBirth"
                            className={inputsWithErrors.includes("dateOfBirth") ? styles.errorInput : ""}
                        />
                    </div>
                    <div className={styles.sensitiveDetails}>
                        <EmailInput 
                            labelText="Email"
                            name="email"
                            placeholder="example@domain.com"
                            className={inputsWithErrors.includes("email") ? styles.errorInput : ""}
                        />

                        <TextInput 
                            labelText="National Identity Number"
                            name="nationalIdentityNumber"
                            placeholder="DDMMÅÅXXXXX"
                            className={inputsWithErrors.includes("nationalIdentityNumber") ? styles.errorInput : ""}
                        />
                        <PasswordInput 
                            labelText="Password"
                            name="password"
                            className={inputsWithErrors.includes("password") ? styles.errorInput : ""}
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