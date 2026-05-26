import Skeleton from "react-loading-skeleton"

import cardStyles from "../layout/DoctorCard.module.css"
import listStyles from "../layout/DoctorList.module.css"


export default function DoctorListSkeleton() {

    const list = [...Array(3)]

    return <div className={listStyles.layout}>
            {list.map((_, index) => (
                <div key={index} className={cardStyles.layout}>
                    <Skeleton width={200} height={50}/>
                    <Skeleton width={200} height={20}/>
                    <Skeleton width={200} height={20}/>
                </div>
            ))}
            </div>
}