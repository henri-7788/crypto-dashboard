'use client';
import React, { useState, useEffect, createContext, useContext } from "react";

const ThemeContext = createContext<any>(null);
export function useTheme() {
  return useContext(ThemeContext);
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved) setTheme(saved);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.body.classList.remove("light", "dark");
      document.body.classList.add(theme);
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {/* Toggle Regler oben rechts */}
      <div style={{ position: "fixed", top: 20, right: 32, zIndex: 50 }}>
        <button
          aria-label="Toggle Darkmode"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded-full bg-gray-200 dark:bg-gray-800 p-2 shadow hover:scale-105 transition-transform"
        >
          {theme === "dark" ? (
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" stroke="#facc15" strokeWidth="2"/></svg>
          ) : (
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" stroke="#6366f1" strokeWidth="2"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="#6366f1" strokeWidth="2"/></svg>
          )}
        </button>
      </div>
      {children}
    </ThemeContext.Provider>
  );
} 