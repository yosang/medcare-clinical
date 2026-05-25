
import { useLoginStore } from "../../stores/useLoginStore";
import { useNavigate } from "react-router";

import { toast } from "sonner";
import { Link } from "react-router";
import { LogOut } from "lucide-react";

import styles from "./Header.module.css";

import logo from "../../assets/logo.png"
import Button from "../elements/Button";
import ThemeSwitch from "../elements/ThemSwitch";

export default function Header() {

    const navigate = useNavigate();
    const { token, logout } = useLoginStore();

    const handleLogout = () => {
        navigate("/");
        logout();
        toast.success("Logged out!")
    }

    return <nav>
            <div className={styles.navLayout}>
                    <div className={styles.menuItems}>
                        <div className={styles.logo}>
                            <Link to="/"><img src={logo} alt="Web logo" style={{ height: "50px", width: "40px"}}/></Link>
                            <Link to="/"><h2 style={{ color: "var(--color-primary"}}>MedCare Clinical</h2></Link>
                        </div>
                    </div>

                    <div className={styles.menuItems}>
                        <Link to="/book">Booking</Link>
                        <Link to="/search">Search</Link>
                    </div>
                    
                    <div className={styles.menuItems}>

                        <ThemeSwitch />
                        {token ? (
                            <>
                            <LogOut size={45} className={styles.navIcon} onClick={handleLogout}/>
                            </>
                        ):(
                        <>
                            <Link to="/login" style={{ color: "var(--color-secondary-text)" }}><Button variant="secondary">Login</Button></Link>
                            <Link to="/register" style={{ color: "var(--color-primary-text)" }}><Button >Register</Button></Link>
                        </>
                        )}
                    </div>
                </div>
            </nav>
}