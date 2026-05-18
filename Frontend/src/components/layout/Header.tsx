import { Link } from "react-router";
import styles from "./Header.module.css";

export default function Header() {
    return  <nav className={styles.layout}>
                <Link to="/book">Booking</Link>
                <Link to="/register">Register</Link>
                <Link to="/login">Login</Link>
                <Link to="/search">Search</Link>
            </nav>
}