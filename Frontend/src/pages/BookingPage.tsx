import { useState, type SyntheticEvent } from "react"
import DoctorSelection from "../components/forms/DoctorSelection";
import CategorySelection from "../components/forms/CategorySelection";
import StatusSelection from "../components/forms/StatusSelection";
import { usePatientStore } from "../stores/usePatientStore";
import LoadingSpinner from "../components/layout/LoadingSpinner";

export default function BookingPage() {
    const [clinic, setClinic] = useState<number | null>(null)

    const { patient, loading, error, createPatient } = usePatientStore();

    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [phone, setPhone] = useState("");

    const clearInputs = () => {
        setFirstname("");
        setLastname("");
        setPhone("");
    }

    const handleSubmit = async(e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        if( !firstname || !lastname || !phone ) {
            alert("Please fill out all fields")
            return;
        }

        try {

            const newPatient = await createPatient({ firstname, lastname, phone })
    
            formData.append("ClinicId", String(clinic))
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
        <DoctorSelection clinicSetter={setClinic}/>
        <CategorySelection />
        <StatusSelection />
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
        </div>
        
        <button type="submit">{loading ? (<LoadingSpinner />):"Book"}</button>

        {error && <p style={{ color: "red" }}>Unable to create patient</p>}
        {patient && <p style={{ color: "green" }}>Creating appointment...</p>}
    </form>
    </>
    )
}