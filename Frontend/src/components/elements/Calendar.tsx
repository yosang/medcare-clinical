import { useEffect, useMemo, useRef, useState } from "react";

import styles from "./Calendar.module.css"
import type { Appointment } from "../../types/Appointments";
import { toast } from "sonner";

export default function Calendar( { upcoming, appointments }:{ upcoming: Appointment | null, appointments: Appointment[] | undefined}) {

    const toastRef = useRef<string | number | null>(null)

    const [month, setMonth] = useState(new Date().getMonth());
    const [year, setYear] = useState(new Date().getFullYear());
    
    const [dayPadding, setDayPadding] = useState<string[]>([]);
    const [days, setDays] = useState<string[]>([]);
    
    const firstDateInCurrentMonth = useMemo(() => new Date(year, month, 1), [month, year])
    const lastDateInCurrentMonth = useMemo(() => new Date(year, month + 1, 0), [month, year])
    
    const firstDayWeekIndex = firstDateInCurrentMonth.getDay();
    const amountOfPadding = firstDayWeekIndex === 0 ? 6: firstDayWeekIndex - 1;

    const totalDaysInCurrentMonth = lastDateInCurrentMonth.getDate();
    
    const currentMonth = useMemo(() => new Date(year, month).toLocaleDateString(undefined, {month: "long", year:"numeric"}), [month, year])
    
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


    const upcomingAppointment = useMemo(() => {
        return upcoming?.appointmentDate ? new Date(upcoming.appointmentDate) : null;
    }, [upcoming])

    const pendingAppointments = useMemo(() => {
        if(!appointments) return [];
        return appointments.filter(a => a.status.id == 1).map(a => new Date(a.appointmentDate))
    }, [appointments])

    useEffect(() => {
            
        const paddingToAdd = [];
        const daysToAdd = [];
        
        for(let i = 0; i < amountOfPadding; i++) {
            paddingToAdd.push("");
        }
        
        for(let i = 1; i <= totalDaysInCurrentMonth; i++) {
            daysToAdd.push(i.toString());
        }
        
        // eslint-disable-next-line
        setDays([...daysToAdd])
        setDayPadding([...paddingToAdd]);
    }, [month, year, amountOfPadding, totalDaysInCurrentMonth])

    return  (
    <div className={styles.layout}>
        <div className={styles.header}>
            <div onClick={handlePrev}>◀</div>
            <div>{currentMonth}</div>
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

            const isUpcoming = () => {
                if (!upcomingAppointment) return false;

                return (
                    upcomingAppointment.getDate() == Number(d) &&
                    upcomingAppointment.getMonth() == month &&
                    upcomingAppointment.getFullYear() == year
                );
            }

            const isPending = () => {
                return pendingAppointments.some(date => 
                    date.getDate() == Number(d) &&
                    date.getMonth() == month &&
                    date.getFullYear() == year
                )
            }
            
            return (<div
                        key={d}
                        id={d}
                        className={`${ isUpcoming() ? styles.upcomingHighlighted : isPending() ? styles.pendingHighlighted: ""}`}
                        onClick={(e) => {
                            if(toastRef.current) return;

                            const element = e.currentTarget as HTMLDivElement;

                            const appointmentsOnThisDay = pendingAppointments.filter(date => 
                                date.getDate() == Number(element.id) &&
                                date.getMonth() == month &&
                                date.getFullYear() == year
                            )

                            if(!appointmentsOnThisDay.length) return;
                            
                            const toastContent = (
                                <div style={{ padding: "var(--spacing-md)" }}>

                                <p>You have {appointmentsOnThisDay.length} {appointmentsOnThisDay.length > 1 ? "appointments":"appointment"} on the {element.id}th:</p>
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
                        }}
                    >
                        {d}
                    </div>)
           })}
        </div>
    </div>
    )
}