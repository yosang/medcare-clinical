import { useState, type ChangeEvent } from "react"
import styles from "./AppointmentsTable.module.css"
import { Drawer } from "./Drawer"
import { useAppointmentsStore } from "../../stores/useAppointmentsStore"
import StatusSelection from "../forms/StatusSelection";
import Button from "./Button";
import CategorySelection from "../forms/CategorySelection";
import DurationSelection from "../forms/DurationSelection";
import DateTimeSelector from "../forms/DateTimeSelector";
import TextArea from "../forms/TextArea";

type AppointmentForm = {
    AppointmentDate: string,
    Duration: number,
    Note: string,
    DoctorId: number,
    ClinicId: number,
    CategoryId: number,
    StatusId: number
}

export default function AppointmentsTable() {
    const { appointments } = useAppointmentsStore();
    const [open, setOpen] = useState(false)

    const[form, setForm] = useState<AppointmentForm | null>(null);

    const handleSubmit  = (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        console.log(form)
    }

    const handleAppointmentClick = (id:number) => {
        const ap = appointments?.find(ap => ap.id === id);
        if(!ap) return;

        
        setForm({
            AppointmentDate: ap.appointmentDate,
            Duration: ap.duration,
            Note: ap.note,
            DoctorId: ap.doctor.id,
            ClinicId: ap.clinic.id,
            CategoryId: ap.category.id,
            StatusId: ap.status.id
        })

        setOpen(true)
    }

    const handleDrawerClose = () => {
        setOpen(false);
    }

    return  <>
    <Drawer title="Appointment" isOpen={open} onClose={handleDrawerClose}>
        <form onSubmit={handleSubmit}>
            <br />

            <DateTimeSelector 
                value={form?.AppointmentDate}
                onChange={(e:ChangeEvent<HTMLSelectElement>) => setForm(prev => prev ? {...prev, AppointmentDate: e.target.value}:prev)}
            />

            <DurationSelection  
                value={form?.Duration} 
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setForm(prev => prev ? {...prev, Duration: +e.target.value}:prev)}  
            />


            <CategorySelection 
                value={form?.CategoryId}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setForm(prev => prev ? {...prev, CategoryId: +e.target.value}:prev)}
            />
            <br />

            <TextArea 
                value={form?.Note}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setForm(prev => prev ? {...prev, Note: e.target.value}: prev)}
            />
            <br />
                    <StatusSelection 
                        value={form?.StatusId}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => setForm(prev => prev ? {...prev, StatusId: +e.target.value}:prev)}
                    />
            <br />

            <div style={{ display: "flex", justifyContent: "center" }}>
                <Button type="submit" >Save changes</Button>
            </div>

        </form>
    </Drawer>
    <table className={styles.layout}>
                <thead>
                    <tr>
                        <th>Note</th>
                        <th>Date</th>
                        <th>Duration</th>
                        <th>Doctor</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {appointments && appointments.map((ap) => (
                        <tr key={ap.id} onClick={() => handleAppointmentClick(ap.id)}>
                            <td>{ap.note}</td>
                            <td>{ap.appointmentDate}</td>
                            <td>{ap.duration}</td>
                            <td>{ap.doctor.firstName} {ap.doctor.lastName}</td>
                            <td>{ap.status.name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
    </>
}