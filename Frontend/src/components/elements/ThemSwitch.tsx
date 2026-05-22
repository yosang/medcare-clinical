'use client'
import { useEffect, useState } from "react"
import styles from "./ThemeSwitch.module.css"
import { Moon, Sun } from "lucide-react";

/**
 * @description A custom component that gets the current browser theme and sets the theme to match it. It also provides interactive icons
 * to change the them between dark and light
 * @returns {HTMLButtonElement}
 */
export default function ThemeSwitch() {

    const [currentTheme, setCurrentTheme] = useState("");

    const handleChange = () => {
        const changeValue = currentTheme === "dark" ? "light":"dark"
        document.documentElement.setAttribute("data-theme", changeValue)
        setCurrentTheme(changeValue)
    }

    useEffect(() => {
        const currentDocumentTheme = document.documentElement.getAttribute("data-theme");
        const currentBrowserTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark":"light"
        setCurrentTheme(currentDocumentTheme ?? currentBrowserTheme);
    }, [])

    return <button 
            aria-label="Toggle theme"
            className={styles.switcher} 
            onClick={handleChange}>
                <span>
                    {currentTheme === "dark" 
                    ? <Sun aria-hidden={true}className={styles.sun}/>
                    : <Moon aria-hidden={true}className={styles.moon}/>}
                </span>
            </button>
}