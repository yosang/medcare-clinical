import { lazy, Suspense, useMemo, useState } from "react"

import styles from "./styles/BookingPage.module.css"
import { MessageSquareText, NotebookPen, NotepadText } from "lucide-react";

import { useLoginStore } from "../stores/useLoginStore";
import { usePatient } from "../queries/usePatients";
import { useAppointments, useAppointmentsPaginated } from "../queries/useAppointments";

import SideInfo from "../components/elements/SideInfo";
import Calendar from "../components/elements/Calendar";
import BookingFormSkeleton from "../components/skeletons/BookingFormSkeleton";
import AppointmentsTableSkeleton from "../components/skeletons/AppointmentsTableSkeleton";

// lazy loaded components
const BookingForm = lazy(() => import("../components/forms/BookingForm"))
const AppointmentsTable = lazy(() => import("../components/elements/AppointmentsTable"))

export default function BookingPage() {

    // local states
    const [pageSize, setPageSize] = useState("3")
    const [statusFilter, setStatusFilter] = useState("");

    // Gloobal states
    const token = useLoginStore((s) => s.token);

    // Reading queries
    const { data: patient } = usePatient();
    const { data: appointmentsInfinite, fetchNextPage, hasNextPage, isFetchingNextPage } = useAppointmentsPaginated(pageSize, statusFilter || undefined); 
    const { data: appointmentsCalendarWidget } = useAppointments("asc"); // for the calendar widget we always it to be sorted asc, so our upcoming variable works correctly

    // Flattens the appointments object returned by useInfiniteQuery
    const appointments = useMemo(() => {
        return appointmentsInfinite?.pages.flatMap(page => page.data);
    }, [appointmentsInfinite])

    // Finds the first upcoming pending appointment
    // We are memoizing this variable to prevent the Calendar component from re-rendering, unless appointments change.
    const upcoming = useMemo(() => {
        if (!appointmentsCalendarWidget) return;

        return appointmentsCalendarWidget.find(a => a.status.id === 1);

    }, [appointmentsCalendarWidget])

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

                            <Calendar upcoming={upcoming} appointments={appointmentsCalendarWidget}/>
                        </div>
                    </div>
                    <div className={styles.appointmentHistory}>
                       <Suspense fallback={<AppointmentsTableSkeleton />}>
                           <AppointmentsTable 
                                appointments={appointments} 
                                nextPage={fetchNextPage} 
                                hasNextPage={hasNextPage} 
                                loadingNextPage={isFetchingNextPage}
                                statusFilter={statusFilter}
                                statusSetter={setStatusFilter}
                                pageSize={pageSize}
                                pageSizeSetter={setPageSize}
                        />
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