import { useState, type ChangeEvent } from "react"
import styles from "./AppointmentsTable.module.css"
import { Drawer } from "./Drawer"
import { useAppointmentsStore } from "../../stores/useAppointmentsStore"
import Button from "./Button";
import CategorySelection from "../forms/CategorySelection";
import DurationSelection from "../forms/DurationSelection";
import DateTimeSelector from "../forms/DateTimeSelector";
import TextArea from "../forms/TextArea";
import { useLoginStore } from "../../stores/useLoginStore";
import type { AppointmentUpdateForm } from "../../types/Appointments";
import { toast } from "sonner";
import LoadingSpinner from "../layout/LoadingSpinner";

export default function AppointmentsTable() {
    const {token } = useLoginStore();
    const { loading, error, errorMessage, clearErrors, appointments, getAppointments, getAppointment, updateAppointment, cancelAppointment } = useAppointmentsStore();
    const [open, setOpen] = useState(false)

    const[apId, setApId] = useState<number | null>(null);
    const[form, setForm] = useState<AppointmentUpdateForm | null>(null);

    const handleSubmit  = (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!token) return
        if(!form) return
        if(!apId) return

        toast.promise(updateAppointment(form, token, apId), {
            position: "top-center",
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

    const handleCancel = () => {
        if(!token) return
        if(!apId) return

        toast("This action cannot be undone, are you sure you want to cancel your appointment?", {
            position: "top-center",
            action: {
                label: "Yes",
                onClick: () => {
                    toast.promise(cancelAppointment(token, apId), {
                        position: "top-center",
                        loading: "Cancelling appointment...",
                        success: () => {
                            getAppointments(token);
                            setOpen(false);
                            setApId(null);
                            return "Appointment cancelled!"
                        },
                        error: (err) => {
                            console.log(err.message)
                            return "Failed to cancel appointment"
                        }
                    })
                }
            },
            cancel: {
                label: "No",
                onClick: () => {}
            }
        })
    }

    const handleAppointmentClick = async (id:number) => {
        if(!token) return
        const appointment = await getAppointment(token, id)
        
        if(!appointment) return;

        setApId(appointment.id);

        setForm({
            appointmentDate: appointment.appointmentDate,
            duration: appointment.duration,
            note: appointment.note,
            doctorId: appointment.doctor.id,
            clinicId: appointment.clinic.id,
            categoryId: appointment.category.id,
        })

        setOpen(true)
    }
    
    const handleDrawerClose = () => {
        setOpen(false);
        setApId(null);
        clearErrors();
    }

    const isCancelled = (() => {
        if(!appointments) return undefined
        const cancelled = appointments.find(ap => ap.id === apId && ap.status.id === 3)
        if(cancelled) return true
    })()

    return  <>
    <Drawer title="Appointment" isOpen={open} onClose={handleDrawerClose}>
        {loading ? (<LoadingSpinner />):(
            <>
            
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", height: "85vh"}}>
            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                <br />

                <DateTimeSelector 
                    disabled={isCancelled}
                    value={form?.appointmentDate}
                    onChange={(e:ChangeEvent<HTMLSelectElement>) => setForm(prev => prev ? {...prev, appointmentDate: e.target.value}:prev)}
                />

                <DurationSelection  
                    disabled={isCancelled}
                    value={form?.duration} 
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setForm(prev => prev ? {...prev, duration: +e.target.value}:prev)}  
                />


                <CategorySelection 
                    disabled={isCancelled}
                    value={form?.categoryId}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setForm(prev => prev ? {...prev, categoryId: +e.target.value}:prev)}
                />
                <br />

                <TextArea 
                    disabled={isCancelled}
                    value={form?.note}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setForm(prev => prev ? {...prev, note: e.target.value}: prev)}
                />
                <br />
                {error && <p style={{ color: "red" }}>{errorMessage}</p>}
            </div>

            <div style={{ display: "flex", justifyContent: "center", padding: "var(--spacing-md) 0"}}>
                <Button disabled={isCancelled} type="submit" >Save</Button>
            </div>
        </form>
        <div style={{ display: "flex", justifyContent: "center" }}>
            <Button  disabled={isCancelled} onClick={handleCancel} style={{ backgroundColor: "red" }}>Cancel Appointment</Button>
        </div>
            </>
        )}
    </Drawer>
    <table className={styles.layout}>
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Duration</th>
                        <th>Doctor</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {appointments && appointments.sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime()).map((ap) => (
                        <tr key={ap.id} onClick={() => handleAppointmentClick(ap.id)}>
                            <td>{ap.category.name}</td>
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