import Skeleton from "react-loading-skeleton"
import styles from "../forms/RegistrationForm.module.css"

export default function RegistrationSkeleton() {
    return <div className={styles.formLayout} >
                <div className={styles.header}>
                    <Skeleton circle width={40} height={40} />
                    <Skeleton width={220} height={32} />
                </div>
                <div className={styles.inputs}>
                    <div className={styles.personalDetails}>
                        <Skeleton height={68} />
                        <Skeleton height={68} />
                        <Skeleton height={68} />
                        <Skeleton height={68} />
                    </div>
                    <div className={styles.sensitiveDetails}>
                        <Skeleton height={68} />
                        <Skeleton height={68} />
                        <Skeleton height={68} />
                    </div>
                </div>

            <Skeleton height={50} width="50%" borderRadius={8} />
        </div>
}