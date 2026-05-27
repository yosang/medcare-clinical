import { lazy, Suspense } from "react"

import styles from "./BookingPage.module.css"

import { useLoginStore } from "../stores/useLoginStore";

import { usePatient } from "../queries/usePatients";

import SideInfo from "../components/elements/SideInfo";
import BookingFormSkeleton from "../components/skeletons/BookingFormSkeleton";
import AppointmentsTableSkeleton from "../components/skeletons/AppointmentsTableSkeleton";

// lazy loaded components
const BookingForm = lazy(() => import("../components/forms/BookingForm"))
const AppointmentsTable = lazy(() => import("../components/elements/AppointmentsTable"))

export default function BookingPage() {

    // Zustand states
    const token = useLoginStore((s) => s.token);

    // fetches patient details, only fires if user is logged in and there is a token present (this is configured in the query)
    usePatient();

    return <div className={styles.mainLayout}>
            
               {!token && 
                   (<SideInfo 
                       firstHeaderText="professional healthcare"
                       secondHeaderText="Expert Medical Care at Your Fingertips."
                       infoText="Register to track your history. Log in to manage past appointments effortlessly."
                   >
                       <p> Schedule your visit with our world-class specialists in just a few clicks. Your health is our primary mission, supported by precision and absolute trust.</p>
                   </SideInfo>)
               }
        
               <Suspense fallback={<BookingFormSkeleton />}>
                   <BookingForm />
               </Suspense>
           
               {token && 
                   <div className={styles.appointmentHistory}>
                       <h1>My appointments</h1>
                       <Suspense fallback={<AppointmentsTableSkeleton />}>
                           <AppointmentsTable />
                       </Suspense>
                   </div>
               }
           </div>
}