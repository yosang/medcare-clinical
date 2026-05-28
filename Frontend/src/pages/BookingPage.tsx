import { lazy, Suspense } from "react"

import styles from "./BookingPage.module.css"

import { useLoginStore } from "../stores/useLoginStore";

import { usePatient } from "../queries/usePatients";

import SideInfo from "../components/elements/SideInfo";
import BookingFormSkeleton from "../components/skeletons/BookingFormSkeleton";
import AppointmentsTableSkeleton from "../components/skeletons/AppointmentsTableSkeleton";
import { MessageSquareText, NotebookPen, NotepadText } from "lucide-react";

// lazy loaded components
const BookingForm = lazy(() => import("../components/forms/BookingForm"))
const AppointmentsTable = lazy(() => import("../components/elements/AppointmentsTable"))

export default function BookingPage() {

    // TanStack reading query
    const { data: patient } = usePatient();

    // Zustand states
    const token = useLoginStore((s) => s.token);

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
                            <div className={styles.upComingAppointmentCard}>
                                <p style={{ color: "var(--color-muted)" }}>Next appointment</p>
                                <div className={styles.upComingAppointmentCardContent}>
                                    <p>12</p>
                                    <div>
                                        <p>MAY 2024</p>
                                        <p style={{ color: "var(--color-muted)" }}>General Consultation</p>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.linksLayout}>
                                <p>Links</p>
                                <a href="#"><NotepadText size={15} style={{ marginRight: "8px"}}/>Lab Results</a>
                                <a href="#"><NotebookPen size={15} style={{ marginRight: "8px"}}/>Prescriptions</a>
                                <a href="#"><MessageSquareText size={15} style={{ marginRight: "8px"}}/>Message Doctor</a>
                            </div>
                        </div>
                    </div>
                    <div className={styles.appointmentHistory}>
                       <Suspense fallback={<AppointmentsTableSkeleton />}>
                           <AppointmentsTable />
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