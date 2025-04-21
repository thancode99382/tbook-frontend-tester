"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, PlusCircle, LogOut, Search, Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";
import { logout } from '@/services/auth';
import { useRouter } from 'next/navigation';

type NavItem = {
  title: string;
  href: string;
  icon: React.ElementType;
  description?: string;
};

const navItems: NavItem[] = [
  {
    title: "Home",
    href: "/home",
    icon: Home,
    description: "Dashboard and overview",
  },
  {
    title: "Books",
    href: "/books",
    icon: BookOpen,
    description: "Manage your book collection",
  },
  {
    title: "Create Book",
    href: "/createBooksAndChapter",
    icon: PlusCircle,
    description: "Add new books and chapters",
  },
];

export function SimpleSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check if current window width is mobile on component mount and window resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    
    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  // Check for saved theme preference and system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="fixed top-4 left-4 z-50 p-2 bg-background text-foreground border border-border rounded-md shadow-sm"
          aria-label="Toggle menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            {isOpen ? (
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            ) : (
              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            )}
          </svg>
        </button>
      )}
      
      {/* Overlay for mobile menu */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div className={`${
        isMobile 
          ? `fixed top-0 left-0 z-50 h-full w-64 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 ease-in-out` 
          : 'sticky top-0 h-screen w-64 flex-shrink-0'
      } bg-card border-r border-border flex flex-col`}>
        
        {/* Logo and Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">
              <span className="text-gradient">TBook</span>
            </h1>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-md hover:bg-muted transition-colors"
              title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Book Management System</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`${
                      isActive
                        ? 'bg-primary/10 text-primary border-primary/20'
                        : 'text-foreground hover:bg-muted hover:text-primary/80'
                    } flex items-center gap-3 px-3 py-2 rounded-md border border-transparent transition-colors`}
                    onClick={() => isMobile && setIsOpen(false)}
                  >
                    <item.icon size={18} className={isActive ? 'text-primary' : ''} />
                    <div>
                      <div className="font-medium">{item.title}</div>
                      {item.description && (
                        <p className="text-xs text-muted-foreground line-clamp-1">{item.description}</p>
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border mt-auto">
          <Link
            href="/login"
            className="flex items-center gap-2 px-3 py-2 rounded-md text-foreground hover:bg-muted transition-colors w-full"
            onClick={async (e) => {
              e.preventDefault();
              await logout();
            }}
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </Link>
        </div>
      </div>
    </>
  );
}
