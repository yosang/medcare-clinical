import { useState } from "react"
import styles from "./Footer.module.css"

export default function Footer() {
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
    return <footer className={styles.layout}>{currentYear}</footer>
}