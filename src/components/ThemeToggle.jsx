import { Moon, Sun } from "lucide-react"
import { cn } from "../lib/utils"
import { useTheme } from "../context/ThemeContext"

export const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();
    const isDarkMode = theme === "dark";

    return (
        <button 
            onClick={toggleTheme} 
            className={cn(
                "fixed max-sm:hidden top-4 right-4 z-[60] p-2 rounded-full transition-all duration-300 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 shadow-lg", 
                "focus:outline-none hover:scale-110 active:scale-95"
            )}
            aria-label="Toggle theme"
        >
            {isDarkMode ? (
                <Sun className="h-6 w-6 text-yellow-400" />
            ) : (
                <Moon className="h-6 w-6 text-violet-600" />
            )}
        </button>
    )
}

export default ThemeToggle;
