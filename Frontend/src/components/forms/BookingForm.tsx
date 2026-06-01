import { memo, useState, type ChangeEvent, type SyntheticEvent } from "react";

import { useLoginStore } from "../../stores/useLoginStore"
import { useValidationStore } from "../../stores/useValidationStore";

import { useCreateAppointment } from "../../queries/useAppointments";
import { useCreatePatient } from "../../queries/usePatients";
import { findClinicIdByDoctorId, useDoctors } from "../../queries/useLookupQueries";

import styles from "./styles/BookingForm.module.css"
import { ClipboardClock } from "lucide-react"

import Button from "../elements/Button";
import TextInput from "../formElements/TextInput";
import DoctorSelection from "../formElements/DoctorSelection";
import CategorySelection from "../formElements/CategorySelection";
import DateTimeSelector from "../formElements/DateTimeSelector";
import DurationSelection from "../formElements/DurationSelection";
import DateInput from "../formElements/DateInput";
import TextArea from "../formElements/TextArea";
import LoadingSpinner from "../layout/LoadingSpinner";

import { toast } from "sonner";
import { useShallow } from "zustand/shallow";
import { AppointmentSchema } from "../../schemas/appointmentSchema";
import type { Patient } from "../../types/Patients";

export default memo(function BookingForm( { patient }:{ patient?: Patient}) {

    // Reading queries
    const { data: doctors } = useDoctors();
    
    // Mutations
    const createAppointmentMutation = useCreateAppointment();
    const createPatientMutation = useCreatePatient();

    // Global states
    const token = useLoginStore(s => s.token)

    const { validationErrors, errorIdentifier, validate, clearErrors} = useValidationStore(useShallow(s => ({
        validationErrors: s.validationErrors,
        errorIdentifier: s.errorIdentifier,
        validate: s.validate,
        clearErrors: s.clearErrors
    })))
    
    // Local variables
    const initialState = {
        firstname: "",
        lastname: "",
        dateOfBirth: "",
        phone: "",
        note: "",
        duration: "",
        appointmentDateAndTime: "",
        DoctorId: "",
        CategoryId: ""
    }

    const [form, setForm] = useState(initialState)
    
    // Handlers
    const handleSubmit = async(e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        clearErrors();

        try {

            // Builds an object of of data required for appointment creation, which has to be validated first through zod.
            // If a patient is logged in, we use patient details from the patient query
            // If a ptient is not logged in, we use the form values
            const appointmentData = { 
                firstname: token && patient ? patient.firstName: form.firstname,
                lastname: token && patient ? patient.lastName: form.lastname,
                dateOfBirth: token && patient ? patient.dateOfBirth: form.dateOfBirth,
                phone: token && patient ? patient.phone: form.phone,
                DoctorId: form.DoctorId,
                ClinicId: findClinicIdByDoctorId(doctors, form.DoctorId) || "",
                CategoryId: form.CategoryId,
                AppointmentDate: form.appointmentDateAndTime,
                Duration: form.duration,
                Note: form.note
            }

            const dataIsValid = validate(AppointmentSchema, appointmentData)
            if(!dataIsValid) return;

            // If we dont have a token, it means we are not authenticated and this appointment is for a guest user, in which case we create a new guest patient, and assign the new patient Id to patientId.
            // otherwise we use the patientId from the patient details passed down from the parent component.
            let patientId: number

            if(!token) {
                const newPatient = await createPatientMutation.mutateAsync({
                    firstname: appointmentData.firstname,
                    lastname: appointmentData.lastname,
                    dateOfBirth: appointmentData.dateOfBirth,
                    phone: appointmentData.phone
                })

                if(!newPatient || createPatientMutation.error) throw new Error("Something went wrong when trying to create a new guest patient")
                patientId = Number(newPatient.id)
            } else {
                if(!patient) throw new Error("Something when wrong when trying to retrieve logged inn patient details")
                patientId = patient.id
            }

            // Toast promise allows us to handles success and errors. mutateAsync gives us a promsie which allows us to link it up here and handle it as a promise.
            // While I could instead use Tanstacks onSuccess, onError callbacks, Im choosing to keep it in here since we have access component states, such as clearErrors and setForm.
            toast.promise(createAppointmentMutation.mutateAsync({
                AppointmentDate: form.appointmentDateAndTime,
                Duration: Number(form.duration),
                Note: form.note,
                PatientId: patientId,
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
                <ClipboardClock size={40} color="var(--color-primary)" />
                <h1 style={{ color: "var(--color-secondary-text)"}}>Schedule Appointment</h1>
            </div>
            
            {!token && (<div className={styles.personalDetails}>
                <TextInput 
                    labelText="Firstname"
                    value={form.firstname}
                    placeholder={"John"}
                    disabled={!!token}
                    aria-disabled={!!token}
                    aria-invalid={errorIdentifier("firstname")}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setForm(prev => ({ ...prev, firstname: e.target.value }))}
                    style={errorIdentifier("firstname") ? { border: "1px solid red"}:{}}
                />
                        
                <TextInput 
                    labelText="Lastname"
                    value={form.lastname}
                    placeholder={"Doe"}
                    disabled={!!token}
                    aria-disabled={!!token}
                    aria-invalid={errorIdentifier("lastname")}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setForm(prev => ({ ...prev, lastname: e.target.value}))}
                    style={errorIdentifier("lastname") ? { border: "1px solid red"}:{}}
                />
                <DateInput 
                    labelText="Date of birth"
                    value={form.dateOfBirth}
                    disabled={!!token}
                    aria-disabled={!!token}
                    aria-invalid={errorIdentifier("dateOfBirth")}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setForm(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                    style={errorIdentifier("dateOfBirth") ? { border: "1px solid red"}:{}}
                />
                <TextInput 
                    labelText="Phone number"
                    value={form.phone}
                    placeholder={"912 34 567"}
                    disabled={!!token}
                    aria-disabled={!!token}
                    aria-invalid={errorIdentifier("phone")}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setForm(prev => ({ ...prev, phone: e.target.value }))}
                    style={errorIdentifier("phone") ? { border: "1px solid red"}:{}}
                />
            </div>)}
            
            <div className={styles.selection}>

                <DoctorSelection 
                    aria-invalid={errorIdentifier("DoctorId")}                
                    style={errorIdentifier("DoctorId") ? { border: "1px solid red"}:{}} 
                    value={form.DoctorId}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setForm(prev => ({ ...prev, DoctorId: e.target.value}))}    

                />

                <CategorySelection 
                    aria-invalid={errorIdentifier("CategoryId")}                
                    style={errorIdentifier("CategoryId") ? { border: "1px solid red"}:{}} 
                    value={form.CategoryId}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setForm(prev => ({ ...prev, CategoryId: e.target.value}))}    
                />

                <TextArea
                    name="Note"
                    value={form.note}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setForm(prev => ({ ...prev, note: e.target.value}))}
                />
            </div>

            <div className={styles.dateTimeDetails}>
                <DateTimeSelector 
                    required
                    type="datetime-local"
                    value={form.appointmentDateAndTime}
                    aria-invalid={createAppointmentMutation.isError}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setForm(prev => ({ ...prev, appointmentDateAndTime: e.target.value}))}
                    min={new Date().toISOString().slice(0, 16)}
                    style={createAppointmentMutation.isError ? { border: "1px solid red"}:{}}
                />
                <DurationSelection 
                    value={form.duration} 
                    aria-invalid={errorIdentifier("Duration")}      
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setForm(prev => ({ ...prev, duration: e.target.value}))}
                    style={errorIdentifier("Duration") ? { border: "1px solid red"}:{}}
                />
            </div>
            
            <Button 
                    style={{ width: "50%", height: "50px" }} 
                    type="submit" 
                    aria-disabled={createAppointmentMutation.isPending || createPatientMutation.isPending}
                    aria-busy={createAppointmentMutation.isPending || createPatientMutation.isPending}
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
})
