import { Link } from "react-router";
import styles from "./Header.module.css";
import logo from "../../assets/logo.png"
import { LogOut, Search } from "lucide-react";
import { useLoginStore } from "../../stores/useLoginStore";
import { useNavigate } from "react-router";
import Divider from "../elements/Divider";
import { toast } from "sonner";

export default function Header() {
    const navigate = useNavigate();
    const { token, logout } = useLoginStore();

    const handleLogout = () => {
        navigate("/");
        logout();
        toast.success("Logged out!")
    }

    return  <nav className={styles.layout}>
                <Link to="/"><img className={styles.logo} src={logo} alt="Web logo" style={{ height: "100px", width: "80px"}}/></Link>
                
                <div className={styles.menuITems}>
                    <Link to="/book">Booking</Link>
                    <Link to="/search"><Search /></Link>
                    <Divider />

                    {token ? (
                        <LogOut className={styles.logout} onClick={handleLogout}/>
                    ):(
                        <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                    )}
                    
                </div>
            </nav>
}