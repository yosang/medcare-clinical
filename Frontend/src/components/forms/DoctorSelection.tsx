import { useEffect } from "react";
import LoadingSpinner from "../layout/LoadingSpinner";
import { useDoctorsStore } from "../../stores/useDoctorsStore";


export default function DoctorSelection() {
        const { doctors, loading, error, fetchDoctors } = useDoctorsStore();

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
            <label>
                Select your doctor
                <select name="DoctorId" >
                            {doctors.map(d => <option key={d.id} value={d.id}>{d.firstName} {d.lastName}</option>)}
                </select>             
            </label>
            </>
        )   
}