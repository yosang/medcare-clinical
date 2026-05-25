import { MapPin } from "lucide-react";
import styles from "./DoctorCard.module.css";

type Props = {
    name: string,
    specialty: string,
    clinic: string
}
export default function DoctorCard({ name, specialty, clinic }:Props) {
    return <div className={styles.layout}>
                <h1>{name}</h1>
                <p className={styles.specialty}>{specialty}</p>
                <p className={styles.location}>< MapPin />{clinic}</p>
            </div>
}