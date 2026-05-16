import { useEffect, useState, type ChangeEvent } from "react";
import LoadingSpinner from "../layout/LoadingSpinner";
import { useDoctorsStore } from "../../stores/useDoctorsStore";


export default function DoctorSelection() {
        const { doctors, loading, error, fetchDoctors } = useDoctorsStore();

        const [selected, setSelected] = useState<string | undefined>(undefined);

        // Whenever then selection input is interacted with, we are going to update the selected state
        const handleOnChange = (e: ChangeEvent<HTMLSelectElement>) => {
            setSelected(e.target.value);
            }

        // This IFEE retrieves the clinicId required for appointment creation
        const clinicId = (() => {
            if(!doctors) return "";

            if(selected && doctors && doctors.length > 0) {
                const selectedDoc = doctors.find(d => String(d.id) === selected)
                return String(selectedDoc?.clinic.id)
            } 

            // Default to the first doctor if nothing is selected yet
            return String(doctors[0].clinic.id)
        })();

        useEffect(() => {
            if(!doctors) {
                const fetchDocs = async() => {
                    try {
                        await fetchDoctors();
                    } catch(err) {
                        console.log("Something went wrong during fetch of doctors", err)
                    }
                }
                fetchDocs();
            }
        }, [doctors, fetchDoctors])


        if(error) return <p style={{ color: "red" }}>Unable to load doctors</p>
        if(!doctors || loading ) return <LoadingSpinner />

        return (
            <>
            <select name="DoctorId" value={selected ?? String(doctors[0].id)} onChange={handleOnChange} >
                        {doctors.map(d => <option key={d.id} value={d.id}>{d.firstName} {d.lastName}</option>)}
            </select>             
            <input 
                name="ClinicId" 
                value={clinicId} 
                type="hidden" 
            />
            </>
        )   
}