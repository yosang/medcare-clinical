import Skeleton from "react-loading-skeleton"
import styles from "../elements/AppointmentsTable.module.css"

export default function AppointmentsTableSkeleton() {
    return <div className={styles.layout}>
            <Skeleton width={900} count={10} style={{ marginTop: "30px"}} height={18} />
         </div>
    
}