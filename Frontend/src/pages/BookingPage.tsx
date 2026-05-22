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
import { Info } from "lucide-react";
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
    phone: z.string().trim()
                .regex(/^\d{8}$/, "Phone number must be exactly 8 digits")

})

export default function BookingPage() {

    const inputRef = useRef<HTMLInputElement | null>(null);
    const { getClinicId } = useDoctorsStore();

    const { token } = useLoginStore();
    const {  error, errorMessage, clearErrors, loading: loadingAppointment, createAppointment, getAppointments} = useAppointmentsStore();
    const { loading: loadingPatient, createPatient, patient, getPatient } = usePatientStore();

    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [phone, setPhone] = useState("");
    const [note, setNote] = useState("");
    const [duration, setDuration] = useState("30");

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

        const patientData = token && patient ? { 
            firstname: patient.firstName,
            lastname: patient.lastName,
            phone: patient.phone
         }:{
            firstname,
            lastname,
            phone
        }

        const validation = PatientSchema.safeParse(patientData);

        if(!validation.success) {
            setValidationErrors(validation.error.issues.map(err => err.message))
            return
        }

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

        if(token) {
            getAppointments(token);
            getPatient(token);
        }

    }, [getAppointments, getPatient,token])

    return (
    <>
    <div className={styles.mainLayout}>
        {!token && (<div className={styles.sideInfo}>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <h3 style={{ color: "var(--brand-primary)", textTransform: "uppercase"}}>professional healthcare</h3>
                <h1 style={{ fontWeight: "700", lineHeight: "56px", fontSize: "50px", letterSpacing: "-0.02em" }}>Expert Medical Care at Your Fingertips.</h1>
            </div>
            <p> Schedule your visit with our world-class specialists in just a few clicks. Your health is our primary mission, supported by precision and absolute trust.</p>
            <div className={styles.infoCard}>
                <Info size={40} fill="var(--color-primary)" style={{ color: "var(--color-primary-text)" }} />
                <p><strong>Register to track your history.</strong> Log in to manage past appointments effortlessly. </p>
            </div>
            <img src="https://i.imgur.com/8WNM1hA.png" alt="Medical Room Image"/>
        </div>)}
        
        <form onSubmit={handleSubmit} className={styles.formLayout}>
            <div className={styles.personalDetails}>
                <label>
                    Firstname
                    <input 
                        ref={inputRef}
                        required
                        type="text"
                        value={token && patient?.firstName || firstname}
                        placeholder={token && patient ? patient.firstName:"John"}
                        disabled={!!token}
                        onChange={(e) => setFirstname(e.target.value)}
                        />
                </label>
                <label>
                    Lastname
                    <input 
                        required
                        type="text"
                        value={token && patient?.lastName || lastname}
                        placeholder={token && patient ? patient.lastName:"Doe"}
                        disabled={!!token}
                        onChange={(e) => setLastname(e.target.value)}
                        />
                </label>
                <label>
                    Phone number
                    <input 
                        type="tel"
                        value={token && patient?.phone || phone}
                        placeholder={token && patient ? patient.phone:"912 34 567"}
                        disabled={!!token}
                        onChange={(e) => setPhone(e.target.value)}
                        />
                </label>
            </div>
            
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
                            <option value="30">30 minutes</option>
                            <option value="60">60 minutes</option>
                            <option value="90">90 minutes</option>
                        </select>
                    </label>
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
        {token && 
            <div className={styles.appointmentHistory}>
                <h1>My appointments</h1>
                <AppointmentsTable />
            </div>
        }
    </div>
    </>
    )
}