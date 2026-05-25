import type { Doctor } from "../../types/Doctors";
import DoctorCard from "./DoctorCard";
import styles from "./DoctorList.module.css";

type Props = {
    data: Doctor[]
}

export default function DoctorList({data}:Props) {
    return (
        <div className={styles.layout}>
            {data.map(d => (
                    <DoctorCard 
                        key={d.id} 
                        name={d.firstName + " " + d.lastName} 
                        specialty={d.specialty.name} 
                        clinic={d.clinic.name}
                    />
                ))}
        </div>
    )
}