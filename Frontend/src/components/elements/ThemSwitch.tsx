'use client'
import { useEffect } from "react"
import styles from "./ThemeSwitch.module.css"
import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "../../stores/useThemeStore";

/**
 * @description A custom component that gets the current browser theme and sets the theme to match it. It also provides interactive icons
 * to change the them between dark and light
 * @returns {HTMLButtonElement}
 */
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