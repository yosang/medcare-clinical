import { useMemo, useRef, useState } from "react";

import styles from "./styles/Calendar.module.css"

import type { Appointment } from "../../types/Appointments";
import { toast } from "sonner";

export default function Calendar( { upcoming, appointments }:{ upcoming: Appointment | undefined, appointments: Appointment[] | undefined}) {

    const toastRef = useRef<string | number | null>(null)
    
    const [month, setMonth] = useState(new Date().getMonth());
    const [year, setYear] = useState(new Date().getFullYear());

    const [prevUpcomingAppointment, setPrevUpcomingAppointment] = useState<string | undefined>(undefined)
    
    const firstDateInCurrentMonth = useMemo(() => new Date(year, month, 1), [month, year])
    const lastDateInCurrentMonth = useMemo(() => new Date(year, month + 1, 0), [month, year])
    
    const firstDayWeekIndex = firstDateInCurrentMonth.getDay();
    
    const amountOfPadding = firstDayWeekIndex === 0 ? 6: firstDayWeekIndex - 1;
    const totalDaysInCurrentMonth = lastDateInCurrentMonth.getDate();

    // since data from upcoming is delivered asynchronously (through appointments), prevUpcomingAppointment will start of as undefined
    // once upcoming becomes available and passed down to this child (causing a re-render) this conditional will pass as true because upcoming.appointmentDate (when it arrives) will not be equal to prevUpcomingAppointment (which is undefined initially)
    if(upcoming && upcoming.appointmentDate !== prevUpcomingAppointment) { 
        setPrevUpcomingAppointment(upcoming.appointmentDate);
        setMonth(new Date(upcoming.appointmentDate).getMonth())
        setYear(new Date(upcoming.appointmentDate).getFullYear())
    }

    // If upcoming is undefined and prevUpcomingAppointment has value, we can stop tracking by resetting prevUpcomingAppointment to undefined and show the current month instead
    if(!upcoming && prevUpcomingAppointment) {
        setPrevUpcomingAppointment(undefined)
        setMonth(new Date().getMonth())
        setYear(new Date().getFullYear())
    }

    const dayPadding = useMemo(() => {
        const paddingToAdd = [];
        
        for(let i = 0; i < amountOfPadding; i++) {
            paddingToAdd.push("");
        }

        return paddingToAdd
    }, [amountOfPadding])

    const days = useMemo(() => {
        const daysToAdd = [];

        for(let i = 1; i <= totalDaysInCurrentMonth; i++) {
            daysToAdd.push(i);
        }

        return daysToAdd
    }, [totalDaysInCurrentMonth])
    
    const calendarHeaderDate = useMemo(() => new Date(year, month).toLocaleDateString("no-NO", {month: "long", year:"numeric"}), [month, year])
    
    const exactDateMatcher = (date: Date, day: number) => date.getDate() == day && date.getMonth() == month && date.getFullYear() == year // Helper predicate function that looks for a match in a date string with current day, month and year.
    
    const handleNext = () => {
        if(month === 11) {
            setMonth(0);
            setYear(prev => prev + 1);
        } else {
            setMonth(prev => prev + 1);
        }
    }

    const handlePrev = () => {
        if(month === 0) {
            setMonth(11);
            setYear(prev => prev - 1);
        } else {
            setMonth(prev => prev - 1);
        }
    }

    const showCurrent = () => {
        setMonth(new Date().getMonth())
        setYear(new Date().getFullYear())
    }

    const upcomingAppointment = useMemo(() => {
        if(!upcoming) return;

        return upcoming.appointmentDate ? new Date(upcoming.appointmentDate) : null;
    }, [upcoming])

    const pendingAppointments = useMemo(() => {
        if(!appointments) return [];

        return appointments.filter(a => a.status.id == 1).map(a => new Date(a.appointmentDate))
    }, [appointments])

    const clickHandler = (e: React.MouseEvent<HTMLDivElement>) => {
        // if(toastRef.current) return;

        const appointmentsOnThisDay = pendingAppointments.filter(date => exactDateMatcher(date, Number(e.currentTarget.id)));

        if(!appointmentsOnThisDay.length) return;
        
        const toastContent = (
            <div style={{ padding: "var(--spacing-md)" }}>

            <p>You have <strong>{appointmentsOnThisDay.length}</strong> pending {appointmentsOnThisDay.length > 1 ? "appointments":"appointment"} on <strong>{new Date(appointmentsOnThisDay[0]).toLocaleDateString()}</strong></p>
            <br />
            <ul style={{ listStyle: "none" }}>
                {appointmentsOnThisDay.map((a,index) => <li 
                    key={`${index}-${a.getTime()}`}
                    >
                    <strong>Time: </strong>{a.toLocaleTimeString("no-NO", { hour12: false, timeStyle: "short" })}
                </li>)}
            </ul>
            </div>
        )

        toastRef.current = toast.info(toastContent, { 
            closeButton: true,
            duration: 10000,
            onDismiss: () => toastRef.current = null,
            onAutoClose: () => toastRef.current = null},
        )
    }

    return  (
    <div className={styles.layout}>
        <div className={styles.header}>
            <div onClick={handlePrev}>◀</div>
            <div onClick={showCurrent}>{calendarHeaderDate}</div>
            <div onClick={handleNext}>▶</div>
        </div>
        <div className={styles.week}>
            <div>Ma</div>
            <div>Ti</div>
            <div>On</div>
            <div>To</div>
            <div>Fr</div>
            <div>Lø</div>
            <div>Sø</div>
        </div>
        <div className={styles.days}>
           {dayPadding.map((_, index) => <div key={`pad-${index}`}></div>)}
           {days.map(d => {
            
                const isUpcoming = (() => upcomingAppointment ? exactDateMatcher(upcomingAppointment, d) : false )()
                const isPending = (() => pendingAppointments.some(date => exactDateMatcher(date, d) ))()
                
                return (<div
                            key={d}
                            id={String(d)}
                            className={`${ isUpcoming ? styles.upcomingHighlighted : isPending ? styles.pendingHighlighted: ""}`}
                            onClick={clickHandler}
                        >
                            {d}
                        </div>)
            })}
        </div>
    </div>
    )
}