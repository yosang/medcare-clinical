import { type ReactNode } from "react"
import styles from "./Content.module.css"

export default function Content({children}: {children: ReactNode}) {
    return <main className={styles.layout}>{children}</main>
}