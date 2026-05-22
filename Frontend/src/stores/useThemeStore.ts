import { create } from "zustand"

type ThemeState = {
     theme: string | null, 
     setTheme: (theme: string) => void
}

export const useThemeStore = create<ThemeState>((set) => ({
    theme: null,
    setTheme: (theme) => {
        set({ theme: theme})
    }
}))