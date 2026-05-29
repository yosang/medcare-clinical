import { lazy, Suspense, useMemo } from "react"

import styles from "./BookingPage.module.css"

import { useLoginStore } from "../stores/useLoginStore";

import { usePatient } from "../queries/usePatients";

import SideInfo from "../components/elements/SideInfo";
import BookingFormSkeleton from "../components/skeletons/BookingFormSkeleton";
import AppointmentsTableSkeleton from "../components/skeletons/AppointmentsTableSkeleton";
import { MessageSquareText, NotebookPen, NotepadText } from "lucide-react";
import Calendar from "../components/elements/Calendar";
import { useAppointments } from "../queries/useAppointments";

// lazy loaded components
const BookingForm = lazy(() => import("../components/forms/BookingForm"))
const AppointmentsTable = lazy(() => import("../components/elements/AppointmentsTable"))

export default function BookingPage() {

    // TanStack reading query
    const { data: patient } = usePatient();
    const { data: appointments } = useAppointments(); 

    // Zustand states
    const token = useLoginStore((s) => s.token);

    // Creates a copy of appoitments, sorts it and finds the first upcoming pending appointment
    const upcoming = useMemo(() => {
        if (!appointments) return;

        return [...appointments]
                .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime())
                .find(a => a.status.id === 1);

    }, [appointments])

    return <div className={styles.mainLayout}>
            {token ? (
                <div className={styles.loggedInLayout}>
                    <div>
                        <h1>Welcome back {patient ? patient.firstName : ""}</h1>
                        <p>Manage your upcoming appointments in one place!</p>
                    </div>
                    <div className={styles.loggedInBookingLayout}>
                        <Suspense fallback={<BookingFormSkeleton />}>
                            <BookingForm patient={patient}/>
                        </Suspense>
                        <div className={styles.sideCards}>
                            <div className={styles.linksLayout}>
                                <p>Links</p>
                                <a href="#"><NotepadText size={15} style={{ marginRight: "8px"}}/>Lab Results</a>
                                <a href="#"><NotebookPen size={15} style={{ marginRight: "8px"}}/>Prescriptions</a>
                                <a href="#"><MessageSquareText size={15} style={{ marginRight: "8px"}}/>Message Doctor</a>
                            </div>
                            <div className={styles.upComingAppointmentCard}>
                                <p style={{ color: "var(--color-muted)" }}>Next appointment</p>
                                <div className={styles.upComingAppointmentCardContent}>
                                    {upcoming ? (
                                    <>
                                        <p>{new Date(upcoming.appointmentDate).getDate()}</p>
                                        <div>
                                            <p style={{ textTransform: "uppercase" }}>{new Date(upcoming.appointmentDate).toLocaleString("no-NO", { month: "long" })} {new Date(upcoming.appointmentDate).toLocaleString("no-NO", { year: "numeric" })}</p>
                                            <p style={{ color: "var(--color-muted)" }}>{upcoming.category.name}</p>
                                        </div>
                                    </>
                                    ):(
                                        <p>No upcoming appointments...</p>
                                    )}
                                </div>
                            </div>

                            <Calendar upcoming={upcoming} appointments={appointments}/>
                        </div>
                    </div>
                    <div className={styles.appointmentHistory}>
                       <Suspense fallback={<AppointmentsTableSkeleton />}>
                           <AppointmentsTable appointments={appointments}/>
                       </Suspense>
                   </div>
                </div>
            ):(
                <>
                 <SideInfo 
                       firstHeaderText="professional healthcare"
                       secondHeaderText="Expert Medical Care at Your Fingertips."
                       infoText="Register to track your history. Log in to manage past appointments effortlessly."
                       >
                       <p> Schedule your visit with our world-class specialists in just a few clicks. Your health is our primary mission, supported by precision and absolute trust.</p>
                   </SideInfo>

                 <Suspense fallback={<BookingFormSkeleton />}>
                   <BookingForm />
                 </Suspense>
                </>
              )
            }
           </div>
}