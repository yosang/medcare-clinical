import { useEffect, useRef, useState, type SyntheticEvent } from "react"
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
import { BookUser, BriefcaseMedical, CalendarFold } from "lucide-react";
import { useLoginStore } from "../stores/useLoginStore";
import AppointmentsTable from "../components/elements/AppointmentsTable";

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

    const inputRef = useRef<HTMLInputElement | null>(null);
    const { getClinicId } = useDoctorsStore();

    const { token } = useLoginStore();
    const {  error, errorMessage, clearErrors, loading: loadingAppointment, createAppointment, getAppointments} = useAppointmentsStore();
    const { loading: loadingPatient, createPatient } = usePatientStore();

    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [phone, setPhone] = useState("");
    const [note, setNote] = useState("");
    const [duration, setDuration] = useState("15");

    const [validationErrors, setValidationErrors ] = useState<string[] | null>(null);

    const [appointmentDateAndTime, setAppointmentDateAndTime] = useState("");

    const clearInputs = () => {
        setFirstname("");
        setLastname("");
        setPhone("");
        setNote("");
        setValidationErrors(null)
        clearErrors();
    }

    const handleSubmit = async(e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setValidationErrors(null)
        const formData = new FormData(e.currentTarget);
        const docId = formData.get("DoctorId") as string;

        const patientData = {
            firstname,
            lastname,
            phone
        }
        // const patientData = token && appointments ? {
        //     firstname: appointments[0].patient.firstName,
        //     lastname: appointments[0].patient.lastName,
        //     phone: appointments[0].patient.phone,
        // }:{
        //     firstname,
        //     lastname,
        //     phone
        // }

        const validation = PatientSchema.safeParse(patientData);

        if(!validation.success) {
            setValidationErrors(validation.error.issues.map(err => err.message))
            return
        }

        // Create a patient, errors are caught in the catch block
        try {
            const newPatient = await createPatient(patientData)
    
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

    useEffect(() => {
        inputRef.current?.focus();

        if(token) getAppointments(token);

    }, [getAppointments, token])

    return (
    <>

    <form onSubmit={handleSubmit}>
        <div className={styles.layout}>

            <div className={styles.personalDetails}>
                <div className={styles.icon}>
                    <BookUser />
                </div>
                <label>
                    Firstname
                    <input 
                        ref={inputRef}
                        required
                        type="text"
                        value={firstname}
                        disabled={!!token}
                        onChange={(e) => setFirstname(e.target.value)}
                        />
                </label>
                <label>
                    Lastname
                    <input 
                        required
                        type="text"
                        value={lastname}
                        disabled={!!token}
                        onChange={(e) => setLastname(e.target.value)}
                        />
                </label>
                <label>
                    Phone number
                    <input 
                        type="tel"
                        value={phone}
                        disabled={!!token}
                        onChange={(e) => setPhone(e.target.value)}
                        />
                </label>
            </div>
            


            <div className={styles.selection}>
                <div className={styles.icon}>
                    <BriefcaseMedical />
                </div>
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
                <div className={styles.icon}>
                    <CalendarFold />
                </div>    
                <div className={styles.dateTimeInputs}>
                    <label>
                        Appointment Date and time
                        <input
                            required
                            type="datetime-local"
                            value={appointmentDateAndTime}
                            onChange={(e) => setAppointmentDateAndTime(e.target.value)}
                            min={new Date().toISOString().slice(0, 16)}
                        />
                    </label>
                    <label>
                        Appointment Duration
                        <select value={duration} onChange={(e) => setDuration(e.target.value)} >
                            <option value="15">15 minutes</option>
                            <option value="30">30 minutes</option>
                            <option value="45">45 minutes</option>
                            <option value="60">1 hour</option>
                        </select>
                    </label>
                </div>

                <Button type="submit" disabled={loadingAppointment || loadingPatient} >{loadingPatient || loadingAppointment ? (<LoadingSpinner />):"Book new appointment"}</Button>
            
            </div>
            
        </div>
        
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
    {token && 
        <div className={styles.appointmentHistory}>
            <h1>Appointment history</h1>
            <AppointmentsTable />
        </div>
    }
    </>
    )
}