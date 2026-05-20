import { useEffect } from "react";
import LoadingSpinner from "../layout/LoadingSpinner";
import { useStatusStore } from "../../stores/useStatusStore";

export default function StatusSelection( { ...props } ) {
        const { status, loading, error, fetchStatus } = useStatusStore();

        useEffect(() => {
            if(!status) fetchStatus();
        }, [status, fetchStatus])

        if(error) return <p style={{ color: "red" }}>Unable to load statuses</p>
        if(!status || loading) return <LoadingSpinner />

        return <label style={{ display: "flex", flexDirection:"column", gap: "5px", padding:"var(--spacing-sm)" }}>
                Status
                <select  {...props} >
                    {status.map(s => (
                        <option value={s.id} >{s.name}</option>
                    ))}
                 </select>         
                </label>
}