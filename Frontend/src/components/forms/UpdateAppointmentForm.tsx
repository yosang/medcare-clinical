import CategorySelection from "../formElements/CategorySelection";
import DurationSelection from "../formElements/DurationSelection";
import DateTimeSelector from "../formElements/DateTimeSelector";
import TextArea from "../formElements/TextArea";

import { useState, type ChangeEvent } from "react";
import type { Appointment, AppointmentUpdateForm } from "../../types/Appointments";
import Button from "../elements/Button";

type Props = {
    appointment: Appointment
    submitHandler: (formData: AppointmentUpdateForm) => void
    cancelledState: boolean | undefined
    error: boolean,
    errorMessage: string | null
}

export default function UpdateAppointmentForm( { appointment, submitHandler, cancelledState, error, errorMessage }:Props ) {

    const[form, setForm] = useState<AppointmentUpdateForm>({
            appointmentDate: appointment?.appointmentDate,
            duration: appointment?.duration,
            note: appointment?.note,
            doctorId: appointment?.doctor.id,
            clinicId: appointment?.clinic.id,
            categoryId: appointment?.category.id,
    });

    const onSubmitHandler = (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        submitHandler(form)
    }

    return <form onSubmit={onSubmitHandler} style={{ display: "flex", flexDirection: "column", height: "85vh"}}>
            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                <br />

                <DateTimeSelector 
                    disabled={cancelledState}
                    value={form?.appointmentDate}
                    onChange={(e:ChangeEvent<HTMLSelectElement>) => setForm(prev => prev ? {...prev, appointmentDate: e.target.value}:prev)}
                />

                <DurationSelection  
                    disabled={cancelledState}
                    value={form?.duration} 
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setForm(prev => prev ? {...prev, duration: +e.target.value}:prev)}  
                />


                <CategorySelection 
                    disabled={cancelledState}
                    value={form?.categoryId}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setForm(prev => prev ? {...prev, categoryId: +e.target.value}:prev)}
                />
                <br />

                <TextArea 
                    disabled={cancelledState}
                    value={form?.note}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setForm(prev => prev ? {...prev, note: e.target.value}: prev)}
                />
                <br />
                {error && <p style={{ color: "red" }}>{errorMessage}</p>}
            </div>

            <div style={{ display: "flex", justifyContent: "center", padding: "var(--spacing-md) 0"}}>
                <Button disabled={cancelledState} type="submit" >Save</Button>
            </div>
        </form>
}