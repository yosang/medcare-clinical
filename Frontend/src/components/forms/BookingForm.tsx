import { ClipboardClock } from "lucide-react"

import { useState, type ChangeEvent, type SyntheticEvent } from "react";

import { useLoginStore } from "../../stores/useLoginStore"
import { usePatientStore } from "../../stores/usePatientStore";
import { useValidationStore } from "../../stores/useValidationStore";
import { useAppointmentsStore } from "../../stores/useAppointmentsStore";

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
import { useDoctorsStore } from "../../stores/useDoctorsStore";

export default function BookingForm() {

    const { token } = useLoginStore();
    const { getClinicId } = useDoctorsStore();
    const { error, errorMessage, clearErrors: clearBackendErrors, loading: loadingAppointment, createAppointment, getAppointments} = useAppointmentsStore();
    const { loading: loadingPatient, patient, createPatient } = usePatientStore();

    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [phone, setPhone] = useState("");
    const [note, setNote] = useState("");
    const [duration, setDuration] = useState("30");
    const [appointmentDateAndTime, setAppointmentDateAndTime] = useState("");
    
    const { validationErrors, validate, clearErrors} = useValidationStore()

    const clearInputs = () => {
            setFirstname("");
            setLastname("");
            setPhone("");
            setNote("");
            clearErrors();
    }

    const handleSubmit = async(e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        clearErrors();
        clearBackendErrors();

        const formData = new FormData(e.currentTarget);
        const docId = formData.get("DoctorId") as string;

        const patientData = token && patient ? { 
            firstname: patient.firstName,
            lastname: patient.lastName,
            phone: patient.phone
         }:{
            firstname,
            lastname,
            phone
        }

        validate(PatientSchema, patientData)

        try {
            const newPatient = await createPatient(patientData)
    
            toast.promise(createAppointment({
                AppointmentDate: appointmentDateAndTime,
                Duration: Number(duration),
                
                Note: note,
                PatientId: Number(newPatient.id),
                DoctorId: Number(docId),
                ClinicId: Number(getClinicId(docId)),
                CategoryId: Number(formData.get("CategoryId")),
                StatusId: 1
            }), {
                loading: "Creating your ppointment...",
                success: () => {
                    clearInputs();
                    clearErrors();
                    clearBackendErrors();

                    if(token) getAppointments(token);

                    return "Appointment created!"
                },
                error: (err) => {
                    console.log("Something went wrong during appointment creation", err)
                    return "Appointment creation failed"
                }
            })

        } catch(err)
        {
            console.log("Something went wrong during patient creation", err)
            toast.error("Failed to save patient data")
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
                    value={token && patient?.firstName || firstname}
                    placeholder={token && patient ? patient.firstName:"John"}
                    disabled={!!token}
                    onChange={(e) => setFirstname(e.target.value)}
                    />
                <TextInput 
                    labelText="Lastname"
                    value={token && patient?.lastName || lastname}
                    placeholder={token && patient ? patient.lastName:"Doe"}
                    disabled={!!token}
                    onChange={(e) => setLastname(e.target.value)}
                />
                <TextInput 
                    labelText="Phone number"
                    value={token && patient?.phone || phone}
                    placeholder={token && patient ? patient.phone:"912 34 567"}
                    disabled={!!token}
                    onChange={(e) => setPhone(e.target.value)}
                />
            </div>)}
            
            <div className={styles.selection}>
                <DoctorSelection/>
                <CategorySelection />
                <label>
                    Want to leave a note to your doctor?
                    <textarea 
                        name="Note"
                        value={note}
                        onChange={e => setNote(e.target.value)}
                    />
                </label>
            </div>

            <div className={styles.dateTimeDetails}>
                <DateTimeSelector 
                    required
                    type="datetime-local"
                    value={appointmentDateAndTime}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setAppointmentDateAndTime(e.target.value)}
                    min={new Date().toISOString().slice(0, 16)}
                />
                <DurationSelection 
                    value={duration} onChange={(e: ChangeEvent<HTMLSelectElement>) => setDuration(e.target.value)}
                />
            </div>
            
            <Button style={{ width: "50%", height: "50px" }} type="submit" disabled={loadingAppointment || loadingPatient} >{loadingPatient || loadingAppointment ? (<LoadingSpinner />):"Book appointment"}</Button>

            <div className={styles.messages}>

                {validationErrors && validationErrors.length > 0 && (
                        validationErrors.map((error => (
                            <p style={{ color: "red" }}>{error}</p>
                        )))
                    )
                }

                {error && <p style={{ color: "red" }}>{errorMessage}</p>}

            </div>
        </form>
}