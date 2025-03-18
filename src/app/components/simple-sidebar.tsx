"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, BookOpen, PlusCircle } from "lucide-react";

type NavItem = {
  title: string;
  href: string;
  icon: React.ElementType;
};

const navItems: NavItem[] = [
  {
    title: "Home",
    href: "/home",
    icon: Home,
  },
  {
    title: "Search",
    href: "/search",
    icon: Search,
  },
  {
    title: "My Books",
    href: "/my-books",
    icon: BookOpen,
  },
  {
    title: "Create Book",
    href: "/createBooksAndChapter",
    icon: PlusCircle,
  },
];

export function SimpleSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-slate-800 text-white min-h-full p-4">
      <div className="mb-6">
        
        <nav>
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.title}>
                  <Link 
                    href={item.href} 
                    className={`flex items-center gap-3 p-2 rounded transition-colors ${
                      isActive 
                        ? "bg-slate-700 text-white" 
                        : "text-slate-200 hover:bg-slate-700 hover:text-white"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
