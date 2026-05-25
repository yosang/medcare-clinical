import CategorySelection from "../formElements/CategorySelection";
import DurationSelection from "../formElements/DurationSelection";
import DateTimeSelector from "../formElements/DateTimeSelector";
import TextArea from "../formElements/TextArea";

import type { ChangeEvent, Dispatch, SetStateAction } from "react";
import type { AppointmentUpdateForm } from "../../types/Appointments";
import Button from "../elements/Button";

type Props = {
    submitHandler: (e:ChangeEvent<HTMLFormElement>) => void
    formState: AppointmentUpdateForm | null
    formSetter: Dispatch<SetStateAction<AppointmentUpdateForm | null>>
    cancelledState: boolean | undefined
    error: boolean,
    errorMessage: string | null
}

export default function UpdateAppointmentForm( { submitHandler, formState, formSetter, cancelledState, error, errorMessage }:Props ) {
    return <form onSubmit={submitHandler} style={{ display: "flex", flexDirection: "column", height: "85vh"}}>
            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                <br />

                <DateTimeSelector 
                    disabled={cancelledState}
                    value={formState?.appointmentDate}
                    onChange={(e:ChangeEvent<HTMLSelectElement>) => formSetter(prev => prev ? {...prev, appointmentDate: e.target.value}:prev)}
                />

                <DurationSelection  
                    disabled={cancelledState}
                    value={formState?.duration} 
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => formSetter(prev => prev ? {...prev, duration: +e.target.value}:prev)}  
                />


                <CategorySelection 
                    disabled={cancelledState}
                    value={formState?.categoryId}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => formSetter(prev => prev ? {...prev, categoryId: +e.target.value}:prev)}
                />
                <br />

                <TextArea 
                    disabled={cancelledState}
                    value={formState?.note}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => formSetter(prev => prev ? {...prev, note: e.target.value}: prev)}
                />
                <br />
                {error && <p style={{ color: "red" }}>{errorMessage}</p>}
            </div>

            <div style={{ display: "flex", justifyContent: "center", padding: "var(--spacing-md) 0"}}>
                <Button disabled={cancelledState} type="submit" >Save</Button>
            </div>
        </form>
}