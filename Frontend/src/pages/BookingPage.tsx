import { useState, type SyntheticEvent } from "react"
import DoctorSelection from "../components/forms/DoctorSelection";
import CategorySelection from "../components/forms/CategorySelection";
import { usePatientStore } from "../stores/usePatientStore";
import LoadingSpinner from "../components/layout/LoadingSpinner";
import { useDoctorsStore } from "../stores/useDoctorsStore";
import { useAppointmentsStore } from "../stores/useAppointmentsStore";
import { z } from "zod";
import { toast } from "sonner";

import styles from "./BookingPage.module.css"
import Button from "../components/elements/Button";

const PatientSchema = z.object({
    firstname: z.string()
                .trim()
                .min(2, "Firstname must be at least 2 characters")
                .max(100, "Firstname is too long"),
    lastname: z.string()
                .trim()
                .min(2, "Lastname must be at least 2 characters")
                .max(100, "Lastname is too long"),
    phone: z.e164("Phone number must start with a country code prefixed with + and contain only numbers").trim()

})

export default function BookingPage() {
    const { getClinicId } = useDoctorsStore();
    
    const { success, loading: loadingAppointment, createAppointment} = useAppointmentsStore();
    const { loading: loadingPatient, createPatient } = usePatientStore();

    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [phone, setPhone] = useState("");
    const [note, setNote] = useState("");
    const [duration, setDuration] = useState("");

    const [validationErrors, setValidationErrors ] = useState<string[] | null>(null);
    const [backendError, setBackendError] = useState<string | null>(null);

    const [appointmentDateAndTime, setAppointmentDateAndTime] = useState("");

    const clearInputs = () => {
        setFirstname("");
        setLastname("");
        setPhone("");
        setNote("");
        setValidationErrors(null)
        setBackendError(null)
    }

    const handleSubmit = async(e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setValidationErrors(null)
        const formData = new FormData(e.currentTarget);

        const docId = formData.get("DoctorId") as string;

        const validation = PatientSchema.safeParse({ firstname, lastname, phone });

        if(!validation.success) {
            setValidationErrors(validation.error.issues.map(err => err.message))
            return
        }

        // Create a patient, errors are caught in the catch block
        try {
            const newPatient = await createPatient({ firstname, lastname, phone })
    
            // Create an appointment with promise based toast the required values, errors are caught in the error method.
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
                    return "Appointment created!"
                },
                error: (err) => {
                    console.log("Something went wrong during appointment creation", err)
                    setBackendError(err.message)
                    return "Appointment creation failed"
                }
            })

        } catch(err)
        {
            console.log("Something went wrong during patient creation", err)
            toast.error("Failed to save patient data")
        }

    }

    return (
    <>
    <h1>Booking page</h1>
    <form onSubmit={handleSubmit}>
        <div className={styles.layout}>

            <div className={styles.personalDetails}>
                <label>
                    Enter your firstname
                    <input 
                        required
                        type="text"
                        value={firstname}
                        onChange={(e) => setFirstname(e.target.value)}
                        />
                </label>
                <label>
                    Enter your lastname
                    <input 
                        required
                        type="text"
                        value={lastname}
                        onChange={(e) => setLastname(e.target.value)}
                        />
                </label>
                <label>
                    Enter your phone number
                    <input 
                        type="tel"
                        value={phone}
                        placeholder="+4746200264"
                        onChange={(e) => setPhone(e.target.value)}
                        />
                </label>
                <label>
                    Want to leave a note to your doctor?
                    <textarea 
                        name="Note"
                        value={note}
                        onChange={e => setNote(e.target.value)}
                    />
                </label>
            </div>


            <div className={styles.selection}>
                <DoctorSelection/>
                <CategorySelection />
            </div>

            <div className={styles.dateTimeDetails}>
                
            
                <label>
                    Appointment Date and time
                    <input
                        required
                        type="datetime-local"
                        value={appointmentDateAndTime} // We have to validate that the time is available, so we cant just use this blindly
                        onChange={(e) => setAppointmentDateAndTime(e.target.value)}
                        min={new Date().toISOString().slice(0, 16)}
                    />
                </label>
                <label>
                    Appointment Duration
                    <select value={duration} defaultValue="15" onChange={(e) => setDuration(e.target.value)} >
                        <option value="15">15 minutes</option>
                        <option value="30">30 minutes</option>
                        <option value="45">45 minutes</option>
                        <option value="60">1 hour</option>
                    </select>
                </label>

                <Button type="submit" disabled={loadingAppointment || loadingPatient} >{loadingPatient || loadingAppointment ? (<LoadingSpinner />):"Book appointment"}</Button>
            
            </div>
            
        </div>
        
        <div className={styles.messages}>

        {validationErrors && validationErrors.length > 0 && (
                validationErrors.map((error => (
                    <p style={{ color: "red" }}>{error}</p>
                )))
            )
        }

        {backendError && <p style={{ color: "red" }}>{backendError}</p>}

        {success && <p style={{ color: "green" }}>Appointment created</p>}
        </div>
    </form>
    </>
    )
}