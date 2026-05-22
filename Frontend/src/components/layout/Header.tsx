import { Link } from "react-router";
import styles from "./Header.module.css";
import logo from "../../assets/logo.png"
import { LogOut, Search, User } from "lucide-react";
import { useLoginStore } from "../../stores/useLoginStore";
import { useNavigate } from "react-router";
import Divider from "../elements/Divider";
import { toast } from "sonner";
import { useEffect, useState, type ChangeEvent } from "react";
import { Drawer } from "../elements/Drawer";
import { usePatientStore } from "../../stores/usePatientStore";
import LoadingSpinner from "./LoadingSpinner";
import Button from "../elements/Button";

export default function Header() {

    const navigate = useNavigate();
    const { token, logout } = useLoginStore();
    const [open, setOpen] = useState(false);
    const { loading, patient, getPatient } = usePatientStore();

    const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget)

        console.log(formData)

        return
    }

    const handleDelete = () => {
        return
    }

    const handleLogout = () => {
        navigate("/");
        logout();
        toast.success("Logged out!")
    }

    const handleDrawerClose = () => {
        setOpen(false);
    }

    useEffect(() => {
        if(token) getPatient(token);
    }, [getPatient, token])

    return  <>
            <Drawer title="My Profile" isOpen={open} onClose={handleDrawerClose}>
                {loading ? <LoadingSpinner />:(
                    <>
                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", height: "85vh"}}>
                    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                        <label style={{ display: "flex", flexDirection:"column", gap: "5px", padding:"var(--spacing-sm)" }}>
                            Firstname
                            <input 
                                name="firstName"
                                value={patient?.firstName}
                                />
                        </label>
                        <label style={{ display: "flex", flexDirection:"column", gap: "5px", padding:"var(--spacing-sm)" }}>
                            Lastname
                            <input 
                                name="lastName"
                                value={patient?.lastName}
                                />
                        </label>
                        <label style={{ display: "flex", flexDirection:"column", gap: "5px", padding:"var(--spacing-sm)" }}>
                            Phone
                            <input 
                                name="phone"
                                value={patient?.phone}
                                />
                        </label>
                        <label style={{ display: "flex", flexDirection:"column", gap: "5px", padding:"var(--spacing-sm)" }}>
                            Email
                            <input 
                                name="email"
                                value={patient?.email}
                                />
                        </label>
                        <label style={{ display: "flex", flexDirection:"column", gap: "5px", padding:"var(--spacing-sm)" }}>
                            National Identity Number
                            <input 
                                name="nationalIdentityNumber"
                                value={patient?.nationalIdentityNumber}
                                />
                        </label>
                    </div>
                        <div style={{ display: "flex", justifyContent: "center", padding: "var(--spacing-md) 0"}}>
                            <Button type="submit">Save</Button>
                        </div>
                    </form>
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <Button onClick={handleDelete} style={{ backgroundColor: "red" }}>Delete my data</Button>
                </div>
                    </>
                )}
            </Drawer>
            <nav className={styles.layout}>
                <Link to="/"><img className={styles.logo} src={logo} alt="Web logo" style={{ height: "100px", width: "80px"}}/></Link>
                
                <div className={styles.menuITems}>
                    <Link to="/book">Booking</Link>
                    <Link to="/search"><Search /></Link>
                    <Divider />

                    {token ? (
                        <>
                        <User className={styles.navIcon} onClick={() => setOpen(true)}/>
                        <LogOut className={styles.navIcon} onClick={handleLogout}/>
                        </>
                    ):(
                        <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                    )}
                    
                </div>
            </nav>
            </>
}