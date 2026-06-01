import { create } from "zustand"
import ThemeSwitch from "../components/elements/ThemSwitch"

type ThemeState = {
     theme: string | null, 
     setTheme: (theme: string) => void
}

/**
 * Simple zustand store used in {@link ThemeSwitch}.
 * - Sets the theme for the client.
 */
export const useThemeStore = create<ThemeState>((set) => ({
    theme: null,
    setTheme: (theme) => {
        set({ theme: theme})
    }
}))