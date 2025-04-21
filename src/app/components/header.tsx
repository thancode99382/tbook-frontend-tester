"use client";

import { useState, useEffect } from "react";
import { Bell, User } from "lucide-react";
import Link from "next/link";
import { logout } from '@/services/auth';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Get user info from local storage or any other source
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user data", error);
        setUser({ name: "User" });
      }
    } else {
      setUser({ name: "User" });
    }
  }, []);

  return (
    <header className="bg-card border-b border-border h-16 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center space-x-4">
        <div className="md:hidden">
          {/* Mobile menu button if needed */}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button 
          className="p-2 rounded-full hover:bg-muted transition-colors relative"
          aria-label="Notifications"
        >
          <Bell size={20} />
          <span className="absolute top-1 right-1 h-2 w-2 bg-primary rounded-full"></span>
        </button>

        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 p-1 rounded-full hover:bg-muted transition-colors"
            aria-label="User menu"
          >
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <User size={18} />
            </div>
            <span className="font-medium text-sm hidden md:inline-block">{user?.name}</span>
          </button>

          {isDropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsDropdownOpen(false)}
                aria-hidden="true"
              ></div>
              <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-md shadow-lg z-50 py-1">
                <div className="px-4 py-2 border-b border-border">
                  <p className="font-medium text-sm">{user?.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email || 'user@example.com'}</p>
                </div>
                
                <div className="py-1">
                  <Link 
                    href="/profile" 
                    onClick={() => setIsDropdownOpen(false)}
                    className="block px-4 py-2 text-sm hover:bg-muted transition-colors"
                  >
                    Your Profile
                  </Link>
                  <Link 
                    href="/settings" 
                    onClick={() => setIsDropdownOpen(false)}
                    className="block px-4 py-2 text-sm hover:bg-muted transition-colors"
                  >
                    Settings
                  </Link>
                </div>
                
                <div className="py-1 border-t border-border">
                  <Link 
                    href="/login" 
                    onClick={async (e) => {
                      e.preventDefault();
                      setIsDropdownOpen(false);
                      await logout();
                    }}
                    className="block px-4 py-2 text-sm text-destructive hover:bg-muted transition-colors"
                  >
                    Sign out
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
