import { useState } from "react"
import styles from "./AppointmentsTable.module.css"
import { Drawer } from "./Drawer"
import type { Appointment } from "../../types/Appointments"

export default function AppointmentsTable({data}:{data: Appointment[] | null}) {
    const [open, setOpen] = useState(false)

    return  <>
    <Drawer title="Draw" isOpen={open} onClose={() => setOpen(false)}>
        <h1>Some stuff</h1>
    </Drawer>
    <table className={styles.layout}>
                <thead>
                    <tr>
                        <th>Note</th>
                        <th>Date</th>
                        <th>Duration</th>
                        <th>Doctor</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {data && data.map((ap) => (
                        <tr onClick={() => setOpen(true)}>
                            <td>{ap.note}</td>
                            <td>{ap.appointmentDate}</td>
                            <td>{ap.duration}</td>
                            <td>{ap.doctor.firstName} {ap.doctor.lastName}</td>
                            <td>{ap.status.name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
    </>
}