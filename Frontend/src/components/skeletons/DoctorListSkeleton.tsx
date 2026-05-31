import Skeleton from "react-loading-skeleton"

import cardStyles from "../layout/styles/DoctorCard.module.css"
import listStyles from "../layout/styles/DoctorList.module.css"

export default function DoctorListSkeleton() {

    const list = [...Array(3)]

    return <div className={listStyles.layout}>
            {list.map((_, index) => (
                <div key={index} className={cardStyles.layout}>
                    <div>
                        <Skeleton width={200} height={250}/>
                    </div>
                    <div className={cardStyles.docDetails}>
                    <Skeleton width={200} height={50}/>
                    <Skeleton width={200} height={20}/>
                    <Skeleton width={200} height={20}/>
                    </div>
                </div>
            ))}
            </div>
}