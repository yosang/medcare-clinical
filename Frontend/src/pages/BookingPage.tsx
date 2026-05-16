import { useState, type SyntheticEvent } from "react"
import DoctorSelection from "../components/forms/DoctorSelection";
import CategorySelection from "../components/forms/CategorySelection";
import { usePatientStore } from "../stores/usePatientStore";
import LoadingSpinner from "../components/layout/LoadingSpinner";
import { useDoctorsStore } from "../stores/useDoctorsStore";

export default function BookingPage() {
    const { getClinicId } = useDoctorsStore();
    
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
        formData.append("ClinicId", getClinicId(docId))
        formData.append("StatusId", "1");

        // Replace this with zod validation
        if( !firstname || !lastname || !phone ) {
            alert("Please fill out all fields")
            return;
        }

        // Create a patient and append the PatientId to formData
        try {
            const newPatient = await createPatient({ firstname, lastname, phone })
    
            formData.append("PatientId", String(newPatient.id))
        
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
                    value={appointmentDateAndTime}
                    onChange={(e) => setAppointmentDateAndTime(e.target.value)}
                    min={new Date().toISOString().slice(0, 16)}
                    name="AppointmentDate" // We have to validate that the time is available, so we cant just use this blindly
                />
            </label>
        </div>
        
        <button type="submit">{loadingPatient ? (<LoadingSpinner />):"Book"}</button>

        {errorPatient && <p style={{ color: "red" }}>Failed to create patient</p>}
    </form>
    </>
    )
}