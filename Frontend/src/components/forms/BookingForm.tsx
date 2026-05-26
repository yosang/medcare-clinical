import { ClipboardClock } from "lucide-react"

import { useState, type ChangeEvent, type SyntheticEvent } from "react";

import { useLoginStore } from "../../stores/useLoginStore"
import { usePatientStore } from "../../stores/usePatientStore";
import { useValidationStore } from "../../stores/useValidationStore";
import { useAppointmentsStore } from "../../stores/useAppointmentsStore";
import { useDoctorsStore } from "../../stores/useDoctorsStore";

import styles from "./BookingForm.module.css"

import TextInput from "../formElements/TextInput";
import Button from "../elements/Button";
import DoctorSelection from "../formElements/DoctorSelection";
import CategorySelection from "../formElements/CategorySelection";
import DateTimeSelector from "../formElements/DateTimeSelector";
import DurationSelection from "../formElements/DurationSelection";
import LoadingSpinner from "../layout/LoadingSpinner";

import { toast } from "sonner";
import { PatientSchema } from "../../schemas/patientSchema";
import { useShallow } from "zustand/shallow";

export default function BookingForm() {

    // Zustand states
    const token = useLoginStore(s => s.token)
    const getClinicId = useDoctorsStore(s => s.getClinicId);

    const { error, errorMessage, clearErrors: clearBackendErrors, loading: loadingAppointment, createAppointment, getAppointments} = useAppointmentsStore(useShallow(s => ({
        error: s.error,
        errorMessage: s.errorMessage,
        clearErrors: s.clearErrors,
        loading: s.loading,
        createAppointment: s.createAppointment,
        getAppointments: s.getAppointments
    })));

    const { loading: loadingPatient, patient, createPatient } = usePatientStore(useShallow(s => ({
        loading: s.loading,
        patient: s.patient,
        createPatient: s.createPatient
    })));

    const { validationErrors, inputsWithErrors, validate, clearErrors} = useValidationStore(useShallow(s => ({
        validationErrors: s.validationErrors,
        inputsWithErrors: s.inputsWithErrors,
        validate: s.validate,
        clearErrors: s.clearErrors
    })))
    
    // Local states
    const initialState = {
        firstname: "",
        lastname: "",
        phone: "",
        note: "",
        duration: "30",
        appointmentDateAndTime: ""
    }

    const [form, setForm] = useState(initialState)
    
    // Handlers
    const handleSubmit = async(e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        clearErrors();
        clearBackendErrors();

        const formData = new FormData(e.currentTarget);
        const docId = formData.get("DoctorId") as string;
        const clinicId = getClinicId(docId) as string;
        const categoryId = formData.get("CategoryId") as string;

        const patientData = token && patient ? { 
            firstname: patient.firstName,
            lastname: patient.lastName,
            phone: patient.phone
         }:{
            firstname: form.firstname,
            lastname: form.lastname,
            phone: form.phone
        }

        validate(PatientSchema, patientData)

        try {
            const newPatient = await createPatient(patientData)
    
            toast.promise(createAppointment({
                AppointmentDate: form.appointmentDateAndTime,
                Duration: Number(form.duration),
                
                Note: form.note,
                PatientId: Number(newPatient.id),
                DoctorId: Number(docId),
                ClinicId: Number(clinicId),
                CategoryId: Number(categoryId),
                StatusId: 1
            }), {
                loading: "Creating your ppointment...",
                success: () => {
                    clearErrors();
                    clearBackendErrors();
                    setForm(initialState);

                    if(token) getAppointments(token);

                    return "Appointment created!"
                },
                error: (err) => {
                    console.log("Something went wrong during appointment creation", err)
                    return "Appointment creation failed, please check your details and try again."
                }
            })

        } catch(err)
        {
            console.log("Something went wrong during patient creation", err)
            toast.error("Failed to save patient data, please check your details and try again.")
        }

    }

    return <form onSubmit={handleSubmit} className={styles.formLayout}>
            <div className={styles.header}>
                <ClipboardClock color="var(--color-primary)" />
                <h1 style={{ color: "var(--color-secondary-text)"}}>Schedule Appointment</h1>
            </div>
            
            {!token && (<div className={styles.personalDetails}>
                <TextInput 
                    labelText="Firstname"
                    value={token && patient?.firstName || form.firstname}
                    placeholder={token && patient ? patient.firstName:"John"}
                    disabled={!!token}
                    onChange={(e) => setForm(prev => ({ ...prev, firstname: e.target.value }))}
                    style={inputsWithErrors.includes("firstname") ? { border: "1px solid red"}:{}}
                    />
                <TextInput 
                    labelText="Lastname"
                    value={token && patient?.lastName || form.lastname}
                    placeholder={token && patient ? patient.lastName:"Doe"}
                    disabled={!!token}
                    onChange={(e) => setForm(prev => ({ ...prev, lastname: e.target.value}))}
                    style={inputsWithErrors.includes("lastname") ? { border: "1px solid red"}:{}}
                />
                <TextInput 
                    labelText="Phone number"
                    value={token && patient?.phone || form.phone}
                    placeholder={token && patient ? patient.phone:"912 34 567"}
                    disabled={!!token}
                    onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
                    style={inputsWithErrors.includes("phone") ? { border: "1px solid red"}:{}}
                />
            </div>)}
            
            <div className={styles.selection}>
                <DoctorSelection/>
                <CategorySelection />
                <label>
                    Want to leave a note to your doctor?
                    <textarea 
                        name="Note"
                        value={form.note}
                        onChange={e => setForm(prev => ({ ...prev, note: e.target.value}))}
                    />
                </label>
            </div>

            <div className={styles.dateTimeDetails}>
                <DateTimeSelector 
                    required
                    type="datetime-local"
                    value={form.appointmentDateAndTime}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setForm(prev => ({ ...prev, appointmentDateAndTime: e.target.value}))}
                    min={new Date().toISOString().slice(0, 16)}
                    style={error ? { border: "1px solid red"}:{}}
                />
                <DurationSelection 
                    value={form.duration} onChange={(e: ChangeEvent<HTMLSelectElement>) => setForm(prev => ({ ...prev, duration: e.target.value}))}
                />
            </div>
            
            <Button style={{ width: "50%", height: "50px" }} type="submit" disabled={loadingAppointment || loadingPatient} >{loadingPatient || loadingAppointment ? (<LoadingSpinner />):"Book appointment"}</Button>

            <div className={styles.messages}>

                {validationErrors && validationErrors.length > 0 && (
                        validationErrors.map(((error, index) => (
                            <p key={index} style={{ color: "red" }}>{error}</p>
                        )))
                    )
                }

                {error && <p style={{ color: "red" }}>{errorMessage}</p>}

            </div>
        </form>
}