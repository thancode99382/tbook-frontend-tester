"use client";

import React from "react";
import { SimpleSidebar } from "./simple-sidebar";
import Header from "./header";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <SimpleSidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
