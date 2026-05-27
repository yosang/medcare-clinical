import { lazy, Suspense,  useMemo, useState } from "react"

import { useLoginStore } from "../../stores/useLoginStore";

import { useAppointments, useAppointment, useUpdateAppointment, useCancelAppointment } from "../../queries/useAppointments";

import styles from "./AppointmentsTable.module.css"

import LoadingSpinner from "../layout/LoadingSpinner";
import Button from "./Button";
import { Drawer } from "./Drawer"
import { toast } from "sonner";

// Lazy loading
const UpdateAppointmentForm = lazy(() => import("../forms/UpdateAppointmentForm"))

import type { AppointmentUpdateForm } from "../../types/Appointments";

export default function AppointmentsTable() {

    // Local states
    const [open, setOpen] = useState(false)
    const[apId, setApId] = useState<number | null>(null);
    
    // TanStack queries
    const { data: appointments } = useAppointments(); 
    const { data: selectedAppointment } = useAppointment(apId);
    
    // TanStack mutations
    const updateMutation = useUpdateAppointment();
    const cancelMutation = useCancelAppointment();

    // Zustand states
    const token = useLoginStore(s => s.token)   
    
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
    const handleSubmit  = (formData: AppointmentUpdateForm) => {
        if(!token || !apId) return

        toast.promise(updateMutation.mutateAsync({ payload: formData, apId }), {
            position: "top-center",
            loading: "Updating appointment...",
            success: () => {
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
                    toast.promise(cancelMutation.mutateAsync(apId), {
                        position: "top-center",
                        loading: "Cancelling appointment...",
                        success: () => {
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
        updateMutation.reset();
        setApId(id);
        setOpen(true)
    }
    
    const handleDrawerClose = () => {
        setOpen(false);
        setApId(null);
        updateMutation.reset();
    }

    return  <>
    <Drawer title="Appointment" isOpen={open} onClose={handleDrawerClose}>
        {!selectedAppointment ? (<LoadingSpinner />):(
            <>
            <Suspense fallback={<LoadingSpinner />}>
                <UpdateAppointmentForm
                    key={apId}
                    appointment={selectedAppointment}
                    submitHandler={handleSubmit}
                    cancelledState={isCancelled}
                    error={updateMutation.isError}
                    errorMessage={updateMutation.error?.message || ""}
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