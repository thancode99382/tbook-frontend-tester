"use client";

import { logout } from "@/services/auth";
import React from "react";

const handleLogout = () => {
  logout();
  window.location.href = "/login";
};

function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="text-xl font-bold">TBook</div>

        <div onClick={handleLogout} className="cursor-pointer font-black text-sm text-red-500 hover:text-gray-700">
          Logout
        </div>
      </div>
    </header>
  );
}

export { Header };
export default Header;
