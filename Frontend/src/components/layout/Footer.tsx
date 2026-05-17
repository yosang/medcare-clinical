import styles from "./Footer.module.css"

export default function Footer() {
    return <footer className={styles.layout}>
        © {new Date().getFullYear()} MIT License. All rights reserved.
        </footer>
}