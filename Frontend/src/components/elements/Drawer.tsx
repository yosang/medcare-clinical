import type { ReactNode } from "react";

import styles from "./styles/Drawer.module.css";

type Props = {
    children: ReactNode,
    isOpen: boolean,
    title: string,
    onClose: () => void,
}

export function Drawer({ children, isOpen, title, onClose }:Props) {
    return (
        <div
            className={`${styles.overlay} ${isOpen ? styles.open : ""}`}
            onClick={onClose}
        >
            <div
                className={`${styles.drawer} ${isOpen ? styles.openDrawer : ""}`}
                onClick={(e) => e.stopPropagation()}
            >
                {title && <h2>{title}</h2>}

                <button className={styles.close} onClick={onClose}>
                    ×
                </button>

                {children}
            </div>
        </div>
    );
}