import { Link } from "react-router";
import styles from "./Header.module.css";
import logo from "../../assets/logo.png"
import { Search } from "lucide-react";

export default function Header() {
    return  <nav className={styles.layout}>
                <Link to="/"><img  className={styles.logo} src={logo} alt="Web logo" style={{ height: "100px", width: "80px"}}/></Link>
                
                <div className={styles.menuITems}>
                    <Link to="/search"><Search /></Link>
                    <Link to="/book">Booking</Link>
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                </div>
            </nav>
}