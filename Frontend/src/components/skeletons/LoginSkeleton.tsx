import Skeleton from "react-loading-skeleton"

import styles from "../forms/styles/LoginForm.module.css";

export default function LoginSkeleton() {
    return <div className={styles.layout}>
            <div className={styles.loginCard}>
                <div className={styles.loginInputs}>
                    <div className={styles.loginHeader}>
                        <Skeleton width={100} height={30} />
                        <Skeleton width={200} height={20} />
                    </div>

                    <Skeleton width={200} height={50} />
                    <Skeleton width={200} height={50} />
                    
                    <Skeleton width={100} height={40} />
                    
                    <Skeleton width={200} height={40} />
                </div>
            </div>
        </div>
}