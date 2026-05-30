import { memo, type ButtonHTMLAttributes, type ReactNode } from "react";
import styles from "./Button.module.css"

type Props = {
    children: ReactNode;
    variant?: "primary" | "secondary"
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default memo(function Button({children, variant = "primary", ...props}:Props ) {
    return <button 
                className={`${styles.layout} ${styles[variant]}`} 
                {...props}
            >
                {children}
            </button>
})