import { useState } from "react"
import styles from "./AppointmentsTable.module.css"
import { Drawer } from "./Drawer"

export default function AppointmentsTable() {
    const [open, setOpen] = useState(false)

    return  <>
    <Drawer title="Draw" isOpen={open} onClose={() => setOpen(false)}>
        <h1>Some stuff</h1>
    </Drawer>
    <table className={styles.layout}>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Duration</th>
                        <th>Note</th>
                        <th>Doctor</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr onClick={() => setOpen(true)}>
                        <td>2026-05-19</td>
                        <td>45 min</td>
                        <td>Need new medicine</td>
                        <td>Mathias</td>
                        <td>Pending</td>
                    </tr>
                    <tr>
                        <td>2026-05-19</td>
                        <td>45 min</td>
                        <td>Health check</td>
                        <td>Mathias</td>
                        <td>Pending</td>
                    </tr>
                    <tr>
                        <td>2026-05-19</td>
                        <td>45 min</td>
                        <td>Health check</td>
                        <td>Mathias</td>
                        <td>Pending</td>
                    </tr>
                    <tr>
                        <td>2026-05-19</td>
                        <td>45 min</td>
                        <td>Health check</td>
                        <td>Mathias</td>
                        <td>Pending</td>
                    </tr>
                    <tr>
                        <td>2026-05-19</td>
                        <td>45 min</td>
                        <td>Health check</td>
                        <td>Mathias</td>
                        <td>Pending</td>
                    </tr>
                    <tr>
                        <td>2026-05-19</td>
                        <td>45 min</td>
                        <td>Health check</td>
                        <td>Mathias</td>
                        <td>Pending</td>
                    </tr>
                    <tr>
                        <td>2026-05-19</td>
                        <td>45 min</td>
                        <td>Health check</td>
                        <td>Mathias</td>
                        <td>Pending</td>
                    </tr>
                    <tr>
                        <td>2026-05-19</td>
                        <td>45 min</td>
                        <td>Health check</td>
                        <td>Mathias</td>
                        <td>Pending</td>
                    </tr>
                    <tr>
                        <td>2026-05-19</td>
                        <td>45 min</td>
                        <td>Health check</td>
                        <td>Mathias</td>
                        <td>Pending</td>
                    </tr>
                    <tr>
                        <td>2026-05-19</td>
                        <td>45 min</td>
                        <td>Health check</td>
                        <td>Mathias</td>
                        <td>Pending</td>
                    </tr>
                </tbody>
            </table>
    </>
}