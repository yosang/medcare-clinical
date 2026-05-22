import { useEffect, useRef, useState,  type ChangeEvent,  type SyntheticEvent } from "react"
import type { Doctor } from "../types/Doctors";
import { fetchDoctorsBySearch } from "../api/shared";
import LoadingSpinner from "../components/layout/LoadingSpinner";
import DoctorList from "../components/layout/DoctorList";
import Button from "../components/elements/Button";
import styles from "./SearchPage.module.css";

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
        if(!e.target.value.trim()) setDoctors(null);
        setTerm(e.target.value)
    }

    useEffect(() => {
        inputRef.current?.focus();
    }, [])

    return (
        <>
        <form onSubmit={handleSubmit} className={styles.layout}>
            <input 
                aria-label="Doctor search"
                ref={inputRef}
                name="name"
                value={term}
                placeholder="Enter firstname or lastname"
                onChange={handleChange}
            />
            <Button type="submit">Search</Button>
        </form>
        {isLoading && <LoadingSpinner />}

        {doctors && doctors.length < 1 && <p>No match</p>}

        {doctors && <DoctorList data={doctors}/>}

        {error && <p style={{ color: "red" }}>Internal Server Error</p>}
        </>
    )
}