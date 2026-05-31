import { lazy, Suspense, useCallback, useMemo, useState } from "react";

import { useLoginStore } from "../../stores/useLoginStore";

import { useAppointment, useUpdateAppointment, useCancelAppointment } from "../../queries/useAppointments";

import styles from "./styles/AppointmentsTable.module.css";

import LoadingSpinner from "../layout/LoadingSpinner";
import Button from "./Button";
import { Drawer } from "./Drawer";
import { toast } from "sonner";

// Lazy loading
const UpdateAppointmentForm = lazy(() => import("../forms/UpdateAppointmentForm"))

import type { Appointment, AppointmentUpdateForm } from "../../types/Appointments";
import UpdateAppointmentSkeleton from "../skeletons/UpdateAppointmentSkeleton";
import { History } from "lucide-react";

export default function AppointmentsTable( { appointments }: { appointments: Appointment[] | undefined}) {

    // Local states
    const [open, setOpen] = useState(false)
    const[apId, setApId] = useState<number | null>(null);
    
    // TanStack queries
    const { data: selectedAppointment } = useAppointment(apId);
    
    // TanStack mutations
    const updateMutation = useUpdateAppointment();
    const cancelMutation = useCancelAppointment();

    // Zustand states
    const token = useLoginStore(s => s.token)   

    const [filter, setFilter] = useState("");

    // Creates a copy of appoitments, sorts and sorts it by date
    const sortedAppointments = useMemo(() => {
        if(!appointments) return [];

        const sorted = [...appointments].sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime()) // sorts appointments by calculating the data in a single milliseconds value

        return filter ? sorted.filter(a => a.status.id == Number(filter)): sorted; // If a filter is provided we return a filtered array, otherwise just show the sorted list
    }, [appointments, filter])

    const isCancelled = useMemo(() => {
        if(!appointments || !apId) return false;
        return appointments.some(ap => ap.id === apId && ap.status.id === 3)
    }, [appointments, apId])

    // Handlers
    const handleSubmit  = useCallback((formData: AppointmentUpdateForm) => {
        if(!token || !apId) return

        toast.promise(updateMutation.mutateAsync({ payload: formData, apId }), {
            position: "top-center",
            loading: "Updating appointment...",
            success: () => {
                setOpen(false);
                setApId(null);
                return "Appointment updated!"
            },
            error: (err) => {
                console.log(err.message)
                return "Failed to update appointment"
            }
        })
    }, [apId, token, updateMutation])

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
        setOpen(true);
        setApId(id);
        updateMutation.reset(); // This clearns the internal state of updateMutation, which allows us to get rid of previous stale error states when opening a new appointment
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
            <Suspense fallback={<UpdateAppointmentSkeleton />}>
                <UpdateAppointmentForm
                    key={apId}
                    appointment={selectedAppointment}
                    submitHandler={handleSubmit}
                    cancelledState={isCancelled}
                    error={updateMutation.isError}
                    errorMessage={updateMutation.error?.message || ""}
                />
        
            <div style={{ display: "flex", justifyContent: "center" }}>
                <Button  disabled={isCancelled} onClick={handleCancel} style={{ backgroundColor: "red" }}>Cancel Appointment</Button>
            </div>
            </Suspense>
            </>
        )}
    </Drawer>
    <div className={styles.header}>
        <div className={styles.headerElements}>
            <History color="var(--color-primary)" />
            <h1 style={{ color: "var(--color-secondary-text)"}}>My Appointments</h1>
        </div>
        <div className={styles.headerElements}>
            <p>Filter by: </p>
            <select value={filter} onChange={(e) => setFilter(e.target.value)} >
                <option value="" >All appointments</option>
                <option value="1" >Pending</option>
                <option value="2" >Completed</option>
                <option value="3" >Cancelled</option>
            </select>
        </div>
    </div>
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
    {sortedAppointments.length < 1 && <p>No appointments to show...</p>}
    </>
}