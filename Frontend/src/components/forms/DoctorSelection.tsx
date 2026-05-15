import { useEffect, useState, type ChangeEvent } from "react";
import type { Doctor } from "../../types/Doctors";
import { fetchDoctors } from "../../services/api";
import LoadingSpinner from "../layout/LoadingSpinner";

type DoctorSelectionProps = {
    clinicSetter: (clinicId: number | null) => void;
};

export default function DoctorSelection( { clinicSetter }:DoctorSelectionProps) {
        const [doctors, setDoctors] = useState<Doctor[] | null>(null)
        const [doctorRequestError, setDoctorRequestError] = useState(false);

        const onHandleOnSelection = (e: ChangeEvent<HTMLSelectElement>) => {
            if(!doctors) return;

            const selected = doctors.find(d => d.id == Number(e.target.value))
            clinicSetter(selected?.clinic.id ?? null)
        }

        useEffect(() => {
            async function fetch() {
                try {
                    const data = await fetchDoctors();
                    setDoctors(data)
                } catch(err) {
                    setDoctorRequestError(true);
                    console.error("An error occurred durin fetch:", err )
                }
            }
            fetch();
        }, [])

        if(doctorRequestError) return <p style={{ color: "red" }}>Unable to load doctors</p>
        if(!doctors) return <LoadingSpinner />

        return <select name="DoctorId" onChange={onHandleOnSelection}>
                        {doctors.map(d => <option key={d.id} value={d.id}>{d.firstName} {d.lastName}</option>)}
                    </select>                
}