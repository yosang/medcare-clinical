import { useEffect } from "react";
import LoadingSpinner from "../layout/LoadingSpinner";
import { useStatusStore } from "../../stores/useStatusStore";


export default function StatusSelection() {
        const { status, loading, error, fetchStatus } = useStatusStore();

        useEffect(() => {
            if(!status) fetchStatus();
        }, [status, fetchStatus])

        if(error) return <p style={{ color: "red" }}>Unable to load statuses</p>
        if(!status || loading) return <LoadingSpinner />

        return <input name="StatusId" value={status[0].id} hidden />           
}