import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { HiSun, HiMoon } from "react-icons/hi";

const ThemeToggler = () => {
   const { theme, setTheme } = useTheme();
   const [mounted, setMounted] = useState(false);
   useEffect(() => setMounted(true), []);
   if (!mounted) return null;
   return (
      <button
         className="w-8 h-8 bg-light-primary rounded-lg dark:bg-dark-primary flex items-center justify-center hover:border-[3px] hover:border-dark-primary transition-colors"
         onClick={() => setTheme(theme === "light" ? "dark" : "light")}
         aria-label="Toggle Dark Mode"
      >
         {theme === "light" ? (
            <HiSun className=" w-5 h-5" />
         ) : (
            <HiMoon className=" w-5 h-5" />
         )}
      </button>
   );
};

export default ThemeToggler;