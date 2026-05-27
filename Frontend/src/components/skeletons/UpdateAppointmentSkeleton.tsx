import Skeleton from "react-loading-skeleton";

export default function UpdateAppointmentSkeleton() {
    return <div style={{ display: "flex", flexDirection: "column", height: "85vh"}}>
                <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                    <br />
    
                    <Skeleton width={100} height={20}/>
                    <Skeleton width="100%" height={40} style={{ marginTop: "8px"}}/>

                    <Skeleton width={100} height={20} style={{ marginTop: "8px"}}/>
                    <Skeleton width="100%" height={40} style={{ marginTop: "8px"}}/>

                    <Skeleton width={100} height={20} style={{ marginTop: "8px"}} />
                    <Skeleton width="100%" height={40} style={{ marginTop: "8px"}}/>

                    <br />
    
                    <Skeleton width={100} height={20} style={{ marginTop: "8px"}} />
                    <Skeleton width="100%" height={40} style={{ marginTop: "8px"}}/>
                    <br />
                </div>
    
                <div style={{ display: "flex", justifyContent: "center", padding: "var(--spacing-md) 0"}}>
                    <Skeleton width={100} height={40}/>
                </div>
                <div style={{ display: "flex", justifyContent: "center", padding: "var(--spacing-md) 0"}}>
                    <Skeleton width={100} height={40} />
                </div>
            </div>
}