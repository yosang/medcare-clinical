import { lazy, Suspense, useEffect, useMemo, useState, type ChangeEvent } from "react"

import { useAppointmentsStore } from "../../stores/useAppointmentsStore"
import { useLoginStore } from "../../stores/useLoginStore";

import styles from "./AppointmentsTable.module.css"

import LoadingSpinner from "../layout/LoadingSpinner";
import Button from "./Button";
import { Drawer } from "./Drawer"
import { toast } from "sonner";

import type { AppointmentUpdateForm } from "../../types/Appointments";
import { useShallow } from "zustand/shallow";

// Lazy loading
const UpdateAppointmentForm = lazy(() => import("../forms/UpdateAppointmentForm"))

export default function AppointmentsTable() {

    // Zustand states
    const token = useLoginStore(s => s.token)
    const { loading, error, errorMessage, clearErrors, appointments, getAppointments, getAppointment, updateAppointment, cancelAppointment } = useAppointmentsStore(useShallow(s => ({
        loading: s.loading,
        error: s.error,
        errorMessage: s.errorMessage,
        clearErrors: s.clearErrors,
        appointments: s.appointments,
        getAppointments: s.getAppointments,
        getAppointment: s.getAppointment,
        updateAppointment: s.updateAppointment,
        cancelAppointment: s.cancelAppointment
    })));
    
    // Local states
    const [open, setOpen] = useState(false)
    const[apId, setApId] = useState<number | null>(null);
    const[form, setForm] = useState<AppointmentUpdateForm | null>(null);
    
    // Memoized operations
    const sortedAppointments = useMemo(() => {
        if(!appointments) return [];
        return [...appointments].sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime()) // sorts appointments by calculating the data in a singular milliseconds value
    }, [appointments])

    const isCancelled = useMemo(() => {
        if(!appointments || !apId) return false;
        return appointments.some(ap => ap.id === apId && ap.status.id === 3)
    }, [appointments, apId])

    // Handlers
    const handleSubmit  = (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!token || !form || !apId) return

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
        if(!token || !apId) return

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

        clearErrors()
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

    useEffect(() => {

        if(token) {
            getAppointments(token);
        }

        // Im disabling the exhaustive-deps rule here intentionally to prevent an infinite loop as getAppointments handles 401 Unauthorized errors and executes an async token refresh.
        // When a new access token is fetched the Zustand store updates, which results in recreating the object returned by useShallow, which changes the functional reference of getAppointments.
        // Including getAppointments in this array will re-trigger this effect every time a token refresh cycle happens. I only want this effect to react to changes in the token.

        // eslint-disable-next-line
    }, [token])

    return  <>
    <Drawer title="Appointment" isOpen={open} onClose={handleDrawerClose}>
        {loading ? (<LoadingSpinner />):(
            <>
            <Suspense fallback={<LoadingSpinner />}>
                <UpdateAppointmentForm
                    submitHandler={handleSubmit}
                    formState={form}
                    formSetter={setForm}
                    cancelledState={isCancelled}
                    error={error}
                    errorMessage={errorMessage}
                />
            </Suspense>
        
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
            {sortedAppointments.map((ap) => (
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