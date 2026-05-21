import { useEffect, useRef, useState,  type ChangeEvent,  type SyntheticEvent } from "react"
import type { Doctor } from "../types/Doctors";
import { fetchDoctorsBySearch } from "../services/api";
import LoadingSpinner from "../components/layout/LoadingSpinner";
import DoctorList from "../components/layout/DoctorList";

export default function SearchPage() {
    const inputRef = useRef<HTMLInputElement | null>(null);

    const [term, setTerm] = useState("");
        const [doctors, setDoctors] = useState<Doctor[] | null>(null)
        const [error, setError] = useState(false);
        const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: SyntheticEvent) => {
        e.preventDefault();
        if(!term.trim()) return;
        
        setDoctors(null);

        try {
            setIsLoading(true);
            const data = await fetchDoctorsBySearch(term);
            setDoctors(data);
            setError(false);
        } catch(err) {
            setError(true);
            console.error("An error occurred durin fetch:", err )
        } finally {
            setIsLoading(false);
        }

    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setTerm(e.target.value)
    }

    useEffect(() => {
        inputRef.current?.focus();
    }, [])

    return (
        <>
        <form onSubmit={handleSubmit}>
            <input 
                aria-label="Doctor search"
                ref={inputRef}
                name="name"
                value={term}
                placeholder="Search for a doctor by firstname / lastname"
                onChange={handleChange}
            />
            <button type="submit">Search</button>
        </form>
        {isLoading && <LoadingSpinner />}

        {doctors && doctors.length < 1 && <p>No match</p>}

        {doctors && <DoctorList data={doctors}/>}

        {error && <p style={{ color: "red" }}>Internal Server Error</p>}
        </>
    )
}