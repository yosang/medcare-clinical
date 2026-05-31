import { useEffect } from "react"

import styles from "./styles/ThemeSwitch.module.css"

import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "../../stores/useThemeStore";

export default function ThemeSwitch() {

    const { theme, setTheme } = useThemeStore();

    const handleChange = () => {
        const changeValue = theme === "dark" ? "light":"dark"
        document.documentElement.setAttribute("data-theme", changeValue)
        setTheme(changeValue)
    }

    useEffect(() => {
        const currentDocumentTheme = document.documentElement.getAttribute("data-theme");
        const currentBrowserTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark":"light"
        setTheme(currentDocumentTheme ?? currentBrowserTheme);
    }, [setTheme])

    return <button 
            aria-label="Toggle theme"
            className={styles.switcher} 
            onClick={handleChange}>
                <span>
                    {theme === "dark" 
                    ? <Sun aria-hidden={true}className={styles.sun}/>
                    : <Moon aria-hidden={true}className={styles.moon}/>}
                </span>
            </button>
}