import type { ReactNode } from "react"
import styles from "./InfoCard.module.css"
import { Info } from "lucide-react"

export default function InfoCard({ children }:{ children: ReactNode}) {
    return <div className={styles.layout}>
                <Info size={40} fill="var(--color-primary)" className={styles.icon} />
                {children}
            </div>
}