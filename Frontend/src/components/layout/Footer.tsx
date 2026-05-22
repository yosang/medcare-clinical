import styles from "./Footer.module.css"

export default function Footer() {
    return <footer className={styles.footerLayout}>
        <div>
        <h2 style={{ color:"var(--color-primary" }}><strong>MediCare Clinical</strong></h2>
        <p>© {new Date().getFullYear()} <strong>MediCare Clinical Systems. All rights reserved.</strong></p>
        </div>

        <div className={styles.links}>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Contact Support</a>
            <a href="#">Emergency Care</a>
        </div>
        </footer>
}