import { useEffect, useState } from "react";
import type { Status } from "../../types/Appointments";
import { fetchStatus } from "../../services/api";
import LoadingSpinner from "../layout/LoadingSpinner";


export default function StatusSelection() {
        const [status, setStatus] = useState<Status[] | null>(null)
        const [statusRequestError, setStatusRequestError] = useState(false);

        useEffect(() => {
            async function fetch() {
                try {
                    const data = await fetchStatus();
                    console.log(data)
                    setStatus(data)
                } catch(err) {
                    setStatusRequestError(true);
                    console.error("An error occurred during fetch:", err )
                }
            }
            fetch();
        }, [])

        if(statusRequestError) return <p style={{ color: "red" }}>Unable to load statuses</p>
        if(!status) return <LoadingSpinner />

        return <input name="StatusId" value={status[0].id} hidden />           
}