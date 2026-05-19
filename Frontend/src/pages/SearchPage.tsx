import { useState,  type ChangeEvent,  type SyntheticEvent } from "react"
import type { Doctor } from "../types/Doctors";
import { fetchDoctorsBySearch } from "../services/api";
import LoadingSpinner from "../components/layout/LoadingSpinner";

export default function SearchPage() {
    const [term, setTerm] = useState("");
        const [doctors, setDoctors] = useState<Doctor[] | null>(null)
        const [error, setError] = useState(false);
        const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: SyntheticEvent) => {
        e.preventDefault();
        if(!term.trim()) return;
        
        try {
            setIsLoading(true);
            const data = await fetchDoctorsBySearch(term);
            setDoctors(data);
            setError(false);
            setIsLoading(false);
        } catch(err) {
            setError(true);
            console.error("An error occurred durin fetch:", err )
        }

    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setTerm(e.target.value)
    }

    return (
        <>
        <form onSubmit={handleSubmit}>
            <label>
                Search for a doctor by firstname / lastname
                <input 
                    name="name"
                    value={term}
                    onChange={handleChange}
                />
                <button type="submit">Search</button>
            </label>
        </form>
        {isLoading && <LoadingSpinner />}
        <ul>
            {doctors && doctors.length < 1 && <p>No match</p>}
            {doctors && doctors.map(d => (
                <li key={d.id}>{d.firstName} {d.lastName} - {d.clinic.name} - {d.specialty.name}</li>
            ))}
        </ul>
        {error && <p style={{ color: "red" }}>Internal Server Error</p>}
        </>
    )
}