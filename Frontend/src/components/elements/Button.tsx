import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.css"

type Props = {
    children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({children, ...props}:Props ) {
    return <button className={styles.layout} {...props}>{children}</button>
}