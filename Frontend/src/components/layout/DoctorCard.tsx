import { MapPin } from "lucide-react";
import styles from "./DoctorCard.module.css";
import { memo } from "react";

type Props = {
    name: string,
    specialty: string,
    clinic: string
}
function DoctorCard({ name, specialty, clinic }:Props) {
    return <div className={styles.layout}>
                <h1>{name}</h1>
                <p className={styles.specialty}>{specialty}</p>
                <p className={styles.location}>< MapPin />{clinic}</p>
            </div>
}

export default memo(DoctorCard)