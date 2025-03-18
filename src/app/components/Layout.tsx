"use client";

import { ReactNode } from "react";
import Header from "./header";
import { SimpleSidebar } from "./simple-sidebar";
// import { SimpleSidebar } from "./simple-sidebar"; // Changed from app-sidebar to simple-sidebar
// import Header from "./header";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <SimpleSidebar /> 
        <main className="flex-1 p-4 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
