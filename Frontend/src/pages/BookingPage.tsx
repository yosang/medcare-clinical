import { useState, type SyntheticEvent } from "react"
import DoctorSelection from "../components/forms/DoctorSelection";
import CategorySelection from "../components/forms/CategorySelection";
import { usePatientStore } from "../stores/usePatientStore";
import LoadingSpinner from "../components/layout/LoadingSpinner";
import { useDoctorsStore } from "../stores/useDoctorsStore";
import { useAppointmentsStore } from "../stores/useAppointmentsStore";

export default function BookingPage() {
    const { getClinicId } = useDoctorsStore();
    
    const { success, loading: loadingAppointment, error: errorAppointment, createAppointment} = useAppointmentsStore();
    const { loading: loadingPatient, error: errorPatient, createPatient } = usePatientStore();

    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [phone, setPhone] = useState("");

    const [appointmentDateAndTime, setAppointmentDateAndTime] = useState("");

    const clearInputs = () => {
        setFirstname("");
        setLastname("");
        setPhone("");
    }

    const handleSubmit = async(e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const docId = formData.get("DoctorId") as string;

        // Replace this with zod validation
        if( !firstname || !lastname || !phone ) {
            alert("Please fill out all fields")
            return;
        }

        // Create a patient and appointment
        try {
            const newPatient = await createPatient({ firstname, lastname, phone })
    
            const appointmentPayload = {
                AppointmentDate: appointmentDateAndTime,
                Note: String(formData.get("Note")),
                PatientId: Number(newPatient.id),
                DoctorId: Number(docId),
                ClinicId: Number(getClinicId(docId)),
                CategoryId: Number(formData.get("CategoryId")),
                StatusId: 1
            }
        
            await createAppointment(appointmentPayload);
            clearInputs();
        } catch(err)
        {
            console.log("Something went wrong during patient creation", err)
        }

    }

    return (
    <>
    <h1>Booking page</h1>
    <form onSubmit={handleSubmit}>
        <DoctorSelection/>
        <CategorySelection />
        <div>
            <label>
                Firstname
                <input 
                    type="text"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                    />
            </label>
            <label>
                Lastname
                <input 
                    type="text"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    />
            </label>
            <label>
                Phone
                <input 
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    />
            </label>
            <label>
                Note to the doc
                <textarea 
                    name="Note"
                />
            </label>
            <label>
                Date
                <input
                    type="datetime-local"
                    value={appointmentDateAndTime} // We have to validate that the time is available, so we cant just use this blindly
                    onChange={(e) => setAppointmentDateAndTime(e.target.value)}
                    min={new Date().toISOString().slice(0, 16)}
                />
            </label>
        </div>
        
        <button type="submit">{loadingPatient || loadingAppointment ? (<LoadingSpinner />):"Book"}</button>

        {errorPatient || errorAppointment && <p style={{ color: "red" }}>Failed to create appointment</p>}
        {success && <p style={{ color: "green" }}>Appointment created</p>}
    </form>
    </>
    )
}