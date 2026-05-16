import { useEffect, type ChangeEvent } from "react";
import LoadingSpinner from "../layout/LoadingSpinner";
import { useDoctorsStore } from "../../stores/useDoctorsStore";

type DoctorSelectionProps = {
    clinicSetter: (clinicId: number | null) => void;
};

export default function DoctorSelection( { clinicSetter }:DoctorSelectionProps) {
        const { doctors, loading, error, fetchDoctors } = useDoctorsStore();

        const onHandleOnSelection = (e: ChangeEvent<HTMLSelectElement>) => {
            if(!doctors) return;

            const selected = doctors.find(d => d.id == Number(e.target.value))
            clinicSetter(selected?.clinic.id ?? null)
        }

        useEffect(() => {
            if(!doctors) fetchDoctors();
        }, [doctors, fetchDoctors])

        if(error) return <p style={{ color: "red" }}>Unable to load doctors</p>
        if(!doctors || loading ) return <LoadingSpinner />

        return <select name="DoctorId" onChange={onHandleOnSelection}>
                        {doctors.map(d => <option key={d.id} value={d.id}>{d.firstName} {d.lastName}</option>)}
                    </select>                
}