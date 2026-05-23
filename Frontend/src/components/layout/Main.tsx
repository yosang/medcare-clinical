import { type ReactNode } from "react"
import styles from "./Main.module.css"
import Footer from "./Footer"

export default function Main({children}: {children: ReactNode}) {
    return <>
    <main className={styles.layout}>
        <div className={styles.content}>
            {children}
        </div>
        <Footer />
    </main>
    </>
}