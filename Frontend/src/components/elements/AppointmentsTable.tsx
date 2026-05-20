import { useState, type ChangeEvent } from "react"
import styles from "./AppointmentsTable.module.css"
import { Drawer } from "./Drawer"
import { useAppointmentsStore } from "../../stores/useAppointmentsStore"
import StatusSelection from "../forms/StatusSelection";
import Button from "./Button";
import CategorySelection from "../forms/CategorySelection";
import DurationSelection from "../forms/DurationSelection";
import DateTimeSelector from "../forms/DateTimeSelector";
import TextArea from "../forms/TextArea";
import { useLoginStore } from "../../stores/useLoginStore";
import type { AppointmentUpdatePayload } from "../../types/Appointments";
import { toast } from "sonner";

export default function AppointmentsTable() {
    const {token } = useLoginStore();
    const { appointments, getAppointments, updateAppointment } = useAppointmentsStore();
    const [open, setOpen] = useState(false)

    const[apId, setApId] = useState<number | null>(null);
    const[form, setForm] = useState<AppointmentUpdatePayload | null>(null);



    const handleSubmit  = (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!token) return
        if(!form) return
        if(!apId) return

        toast.promise(updateAppointment(form, token, apId), {
            loading: "Updating appointment...",
            success: () => {
                getAppointments(token);
                setOpen(false);
                setApId(null);
                return "Update successful!"
            },
            error: (err) => {
                console.log(err.message)
                return "Failed to update appointment"
            }
        })
    }

    const handleAppointmentClick = (id:number) => {
        const ap = appointments?.find(ap => ap.id === id);
        if(!ap) return;

        setApId(ap.id);

        setForm({
            appointmentDate: ap.appointmentDate,
            duration: ap.duration,
            note: ap.note,
            doctorId: ap.doctor.id,
            clinicId: ap.clinic.id,
            categoryId: ap.category.id,
            statusId: ap.status.id
        })

        setOpen(true)
    }
    
    const handleDrawerClose = () => {
        setOpen(false);
        setApId(null);
    }

    return  <>
    <Drawer title="Appointment" isOpen={open} onClose={handleDrawerClose}>
        <form onSubmit={handleSubmit}>
            <br />

            <DateTimeSelector 
                value={form?.appointmentDate}
                onChange={(e:ChangeEvent<HTMLSelectElement>) => setForm(prev => prev ? {...prev, appointmentDate: e.target.value}:prev)}
            />

            <DurationSelection  
                value={form?.duration} 
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setForm(prev => prev ? {...prev, duration: +e.target.value}:prev)}  
            />


            <CategorySelection 
                value={form?.categoryId}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setForm(prev => prev ? {...prev, categoryId: +e.target.value}:prev)}
            />
            <br />

            <TextArea 
                value={form?.note}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setForm(prev => prev ? {...prev, note: e.target.value}: prev)}
            />
            <br />
                    <StatusSelection 
                        value={form?.statusId}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => setForm(prev => prev ? {...prev, statusId: +e.target.value}:prev)}
                    />
            <br />

            <div style={{ display: "flex", justifyContent: "center" }}>
                <Button type="submit" >Save changes</Button>
            </div>

        </form>
    </Drawer>
    <table className={styles.layout}>
                <thead>
                    <tr>
                        <th>Note</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Duration</th>
                        <th>Doctor</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {appointments && appointments.map((ap) => (
                        <tr key={ap.id} onClick={() => handleAppointmentClick(ap.id)}>
                            <td>{ap.note}</td>
                            <td>{new Date(ap.appointmentDate).toLocaleDateString("no-NO")}</td>
                            <td>{new Date(ap.appointmentDate).toLocaleTimeString("no-NO", { hour: "2-digit", minute: "numeric" })}</td>
                            <td>{ap.duration}</td>
                            <td>{ap.doctor.firstName} {ap.doctor.lastName}</td>
                            <td 
                                style={{ 
                                    color: ap?.status.id === 1 
                                    ? "orange"
                                    : ap?.status.id === 2 
                                    ? "green"
                                    : "red"

                             }} >{ap.status.name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
    </>
}