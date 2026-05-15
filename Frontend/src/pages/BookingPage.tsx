import { useState, type SyntheticEvent } from "react"
import DoctorSelection from "../components/forms/DoctorSelection";
import CategorySelection from "../components/forms/CategorySelection";
import StatusSelection from "../components/forms/StatusSelection";

export default function BookingPage() {
    const [clinic, setClinic] = useState<number | null>(null)

    const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        formData.append("ClinicId", String(clinic))
        console.log(formData)
    }

    return (
    <>
    <h1>Booking page</h1>
    <form onSubmit={handleSubmit}>
        <DoctorSelection clinicSetter={setClinic}/>
        <CategorySelection />
        <StatusSelection />
        <button type="submit">Book</button>
    </form>
    </>
    )
}