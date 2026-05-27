import { lazy, Suspense, useEffect } from "react"
import { usePatientStore } from "../stores/usePatientStore";

import styles from "./BookingPage.module.css"

import { useLoginStore } from "../stores/useLoginStore";

import SideInfo from "../components/elements/SideInfo";
import BookingFormSkeleton from "../components/skeletons/BookingFormSkeleton";
import AppointmentsTableSkeleton from "../components/skeletons/AppointmentsTableSkeleton";

// lazy loaded components
const BookingForm = lazy(() => import("../components/forms/BookingForm"))
const AppointmentsTable = lazy(() => import("../components/elements/AppointmentsTable"))

export default function BookingPage() {

    // Zustand states
    const token = useLoginStore((s) => s.token);
    const getPatient = usePatientStore(s => s.getPatient);

    // effects
    useEffect(() => {
        // clearErrors();

        if(token) {
            // getAppointments(token);
            getPatient(token);
        }

    }, [token])

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