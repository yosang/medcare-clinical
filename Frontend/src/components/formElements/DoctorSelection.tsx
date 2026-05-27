import styles from "./SelectElement.module.css"
import { useDoctors } from "../../queries/useLookupQueries";
import Skeleton from "react-loading-skeleton";

export default function DoctorSelection({...props}) {

        const { data, isLoading, isError } = useDoctors();

        if(isLoading ) return <Skeleton width={200} height={18}/>
        if(isError || !data) return <p style={{ color: "red" }}>Unable to reach server</p>

        return (
            <>
            <label>
                Doctor
                <select 
                    name="DoctorId" 
                    className={styles.layout}
                    defaultValue=""
                    {...props}
                >
                        <option value="" disabled hidden>
                            -- Select a doctor --
                        </option>
                            {data.map(d => <option key={d.id} value={d.id}>{d.firstName} {d.lastName}</option>)}
                </select>             
            </label>
            </>
        )   
}