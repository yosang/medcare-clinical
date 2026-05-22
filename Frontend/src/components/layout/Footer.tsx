import styles from "./Footer.module.css"

export default function Footer() {
    return <footer className={styles.layout}>
        <div>
        <p style={{ color:"var(--color-primary" }}><strong>MediCare Clinical</strong></p>
        © {new Date().getFullYear()} MediCare Clinical Systems. All rights reserved.
        </div>

        <div className={styles.links}>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Contact Support</a>
            <a href="#">Emergency Care</a>
        </div>
        </footer>
}