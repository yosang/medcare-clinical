import { ClipboardClock } from "lucide-react"

import { useState, type ChangeEvent, type SyntheticEvent } from "react";

import { useLoginStore } from "../../stores/useLoginStore"
import { useValidationStore } from "../../stores/useValidationStore";

import { useCreateAppointment } from "../../queries/useAppointments";
import { usePatient, useCreatePatient } from "../../queries/usePatients";

import styles from "./BookingForm.module.css"

import TextInput from "../formElements/TextInput";
import Button from "../elements/Button";
import DoctorSelection from "../formElements/DoctorSelection";
import CategorySelection from "../formElements/CategorySelection";
import DateTimeSelector from "../formElements/DateTimeSelector";
import DurationSelection from "../formElements/DurationSelection";
import LoadingSpinner from "../layout/LoadingSpinner";

import { toast } from "sonner";
import { useShallow } from "zustand/shallow";
import { AppointmentSchema } from "../../schemas/appointmentSchema";
import TextArea from "../formElements/TextArea";
import { findClinicIdByDoctorId, useDoctors } from "../../queries/useLookupQueries";

import { type Patient } from "../../types/Patients";

export default function BookingForm() {

    // Tanstack reading queries
    const { data: patient } = usePatient();
    const { data: doctors } = useDoctors();
    
    // TaStack mutations
    const createAppointmentMutation = useCreateAppointment();
    const createPatientMutation = useCreatePatient();

    // Zustand states
    const token = useLoginStore(s => s.token)

    const { validationErrors, inputsWithErrors, validate, clearErrors} = useValidationStore(useShallow(s => ({
        validationErrors: s.validationErrors,
        inputsWithErrors: s.inputsWithErrors,
        validate: s.validate,
        clearErrors: s.clearErrors
    })))
    
    // Local form states
    const initialState = {
        firstname: "",
        lastname: "",
        phone: "",
        note: "",
        duration: "",
        appointmentDateAndTime: ""
    }

    const [form, setForm] = useState(initialState)
    
    // Handlers
    const handleSubmit = async(e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        clearErrors();

        const formData = new FormData(e.currentTarget);
        const docId = formData.get("DoctorId") as string;

        try {
            const appointmentData = { 
                firstname: token && patient ? patient.firstName: form.firstname,
                lastname: token && patient ? patient.lastName: form.lastname,
                phone: token && patient ? patient.phone: form.phone,
                DoctorId: docId,
                ClinicId: findClinicIdByDoctorId(doctors, docId) || "",
                CategoryId: formData.get("CategoryId") as string,
                AppointmentDate: form.appointmentDateAndTime,
                Duration: form.duration,
                Note: form.note
            }

            const dataIsValid = validate(AppointmentSchema, appointmentData)
            if(!dataIsValid) return;

            let newPatient: Patient | null = null;

            // If this is an unregistered user, we create a guest patient and use it's id to create the appointment
            if(!token) newPatient = await createPatientMutation.mutateAsync({
                firstname: appointmentData.firstname,
                lastname: appointmentData.lastname,
                phone: appointmentData.phone
            })

            if(!newPatient || createPatientMutation.error) throw new Error("Unable to map the newly created patient")
    
            toast.promise(createAppointmentMutation.mutateAsync({
                AppointmentDate: form.appointmentDateAndTime,
                Duration: Number(form.duration),
                Note: form.note,
                PatientId: Number(newPatient.id),
                DoctorId: Number(appointmentData.DoctorId),
                ClinicId: Number(appointmentData.ClinicId),
                CategoryId: Number(appointmentData.CategoryId),
                StatusId: 1
            }), {
                loading: "Creating your ppointment...",
                success: () => {
                    clearErrors();
                    setForm(initialState);

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

                <DoctorSelection style={inputsWithErrors.includes("DoctorId") ? { border: "1px solid red"}:{}} />
                <CategorySelection style={inputsWithErrors.includes("CategoryId") ? { border: "1px solid red"}:{}} />

                <TextArea
                    name="Note"
                    value={form.note}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setForm(prev => ({ ...prev, note: e.target.value}))}
                />
            </div>

            <div className={styles.dateTimeDetails}>
                <DateTimeSelector 
                    required
                    type="datetime-local"
                    value={form.appointmentDateAndTime}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setForm(prev => ({ ...prev, appointmentDateAndTime: e.target.value}))}
                    min={new Date().toISOString().slice(0, 16)}
                    style={createAppointmentMutation.isError ? { border: "1px solid red"}:{}}
                />
                <DurationSelection 
                    value={form.duration} 
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setForm(prev => ({ ...prev, duration: e.target.value}))}
                    style={inputsWithErrors.includes("Duration") ? { border: "1px solid red"}:{}}
                />
            </div>
            
            <Button 
                    style={{ width: "50%", height: "50px" }} 
                    type="submit" 
                    disabled={createAppointmentMutation.isPending || createPatientMutation.isPending} 
                >
                    {createAppointmentMutation.isPending || createPatientMutation.isPending ? (<LoadingSpinner />):"Book appointment"}
            </Button>

            <div className={styles.messages}>

                {validationErrors && validationErrors.length > 0 && (
                        validationErrors.map(((error, index) => (
                            <p key={index} style={{ color: "red" }}>{error}</p>
                        )))
                    )
                }

                {createAppointmentMutation.isError && <p style={{ color: "red" }}>{createAppointmentMutation.error?.message}</p>}

            </div>
        </form>
}