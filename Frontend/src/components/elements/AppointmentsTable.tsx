import { lazy, Suspense, useCallback, useMemo, useState } from "react";

import { useLoginStore } from "../../stores/useLoginStore";

import { useAppointment, useUpdateAppointment, useCancelAppointment } from "../../queries/useAppointments";

import styles from "./styles/AppointmentsTable.module.css";
import UpdateAppointmentSkeleton from "../skeletons/UpdateAppointmentSkeleton";
import { History, MessageCircleMore } from "lucide-react";

import LoadingSpinner from "../layout/LoadingSpinner";
import Button from "./Button";
import { Drawer } from "./Drawer";
import { toast } from "sonner";
import { Tooltip } from "react-tooltip";

// Lazy loading
const UpdateAppointmentForm = lazy(() => import("../forms/UpdateAppointmentForm"))

import type { Appointment, AppointmentUpdateForm } from "../../types/Appointments";

type Props = {
    appointments: Appointment[] | undefined
    nextPage: () => void
    hasNextPage: boolean
    loadingNextPage: boolean
    statusFilter: string
    statusSetter: (status: string) => void
}

export default function AppointmentsTable( { appointments, nextPage, hasNextPage, loadingNextPage, statusFilter, statusSetter }:Props) {

    // Local states
    const [open, setOpen] = useState(false)
    const[apId, setApId] = useState<number | null>(null);
    
    // queries
    const { data: selectedAppointment } = useAppointment(apId);
    
    // mutations
    const updateMutation = useUpdateAppointment();
    const cancelMutation = useCancelAppointment();

    // global states
    const token = useLoginStore(s => s.token)   

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
            <History size={40} color="var(--color-primary)" />
            <h1 style={{ color: "var(--color-secondary-text)"}}>My Appointments</h1>
        </div>
        <div className={styles.headerElements}>
            <p>Filter by: </p>
            <select value={statusFilter} onChange={(e) => statusSetter(e.target.value)} >
                <option value="" >All appointments</option>
                <option value="pending" >Pending</option>
                <option value="completed" >Completed</option>
                <option value="cancelled" >Cancelled</option>
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
            {appointments && appointments.map((ap) => (
                <tr key={ap.id} onClick={() => handleAppointmentClick(ap.id)}>
                    <td className={styles.apType}>
                        {ap.category.name} 
                        {ap.note && (
                            <>
                            <span className={styles.apNote} data-tooltip-id={`note-tooltip-${ap.id}`}><MessageCircleMore color="var(--color-primary)" size={20}/></span>
                            <Tooltip 
                                id={`note-tooltip-${ap.id}`}
                                border="1px solid var(--color-primary)"
                                opacity={1}
                                style={{
                                    zIndex: 11,
                                    backgroundColor: "var(--color-secondary)",
                                    color: "var(--color-secondary-text)",
                                    width: "100%",
                                    borderRadius: "var(--radius)",
                                    fontSize: "20px",
                                    padding: "var(--spacing-sm)"
                                }}
                            >
                                {ap.note}
                            </Tooltip>
                            </>
                        )}
                    </td>
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
    {appointments && appointments.length > 0 && (
    <Button 
        disabled={!hasNextPage || loadingNextPage}
        aria-busy={loadingNextPage}
        onClick={() => nextPage()}
        style={{ 
            backgroundColor: !hasNextPage ? "var(--color-muted)":"",
            cursor: !hasNextPage ? "not-allowed":"pointer"
        }}
    >
        {loadingNextPage ? "Loading...":hasNextPage ? "Load more...": "All loaded"}
    </Button>)
    }
    {appointments && appointments.length < 1 && <p>No appointments to show...</p>}
    </>
}