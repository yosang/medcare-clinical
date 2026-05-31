import { lazy, Suspense, useEffect, useRef, useState,  type ChangeEvent,  type SyntheticEvent } from "react"
import type { Doctor } from "../types/Doctors";
import { fetchDoctorsBySearch } from "../api/shared";
import LoadingSpinner from "../components/layout/LoadingSpinner";
import Button from "../components/elements/Button";
import styles from "./SearchPage.module.css";
import TextInput from "../components/formElements/TextInput";
import DoctorListSkeleton from "../components/skeletons/DoctorListSkeleton";

const DoctorList = lazy(() => import("../components/layout/DoctorList"))

export default function SearchPage() {
    
    // refs
    const inputRef = useRef<HTMLInputElement | null>(null);

    // Local states
    const [term, setTerm] = useState("");
    const [doctors, setDoctors] = useState<Doctor[] | null>(null)
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // handlers
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
            console.error("An error occurred during fetch:", err )
        } finally {
            setIsLoading(false);
        }

    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if(!e.target.value.trim()) setDoctors(null);
        setTerm(e.target.value)
    }

    // effects
    useEffect(() => {
        inputRef.current?.focus();
    }, [])

    return (
        <>
        <div className={styles.search}>
            <div>
                <h1>Find a doctor</h1>
            </div>
            <form onSubmit={handleSubmit} className={styles.formLayout}>
                <TextInput 
                    ref={inputRef}
                    placeholder="Enter firstname or lastname"
                    value={term}
                    onChange={handleChange}
                />
                <Button type="submit">Search</Button>
            </form>
  
            <div className={styles.searchResult}>
                {isLoading && <LoadingSpinner />}

                {doctors && doctors.length < 1 && <p>No match</p>}

                {doctors && (
                    <Suspense fallback={<DoctorListSkeleton />}>
                        <DoctorList data={doctors}/>
                    </Suspense>
                )}

                {error && <p style={{ color: "red" }}>Internal Server Error</p>}
            </div>
        </div>
        </>
    )
}