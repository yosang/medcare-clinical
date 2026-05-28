import { MapPin } from "lucide-react";
import styles from "./DoctorCard.module.css";
import { memo } from "react";

type Props = {
    name: string,
    specialty: string,
    clinic: string,
    image: string
}
function DoctorCard({ name, specialty, clinic, image }:Props) {
    return <div className={styles.layout}>
                <div>
                    <img width={200} src={image} alt="Doctor Profile Image"/>
                </div>
                <div className={styles.docDetails}>
                    <h1>{name}</h1>
                    <p className={styles.specialty}>{specialty}</p>
                    <p className={styles.location}>< MapPin />{clinic}</p>
                </div>
            </div>
}

export default memo(DoctorCard)