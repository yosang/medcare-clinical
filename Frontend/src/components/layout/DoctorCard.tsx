import styles from "./DoctorCard.module.css";

type Props = {
    name: string,
    specialty: string,
    clinic: string
}
export default function DoctorCard({ name, specialty, clinic }:Props) {
    return <div className={styles.layout}>
                <h1>{name}</h1>
                <p>{specialty}</p>
                <p>{clinic}</p>
            </div>
}