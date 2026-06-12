"use client";

import { useAuth } from "@/context/AuthContext";
import { Bell, User, Menu } from "lucide-react";
import { useAdminMobile } from "@/context/AdminMobileContext";

interface Props {
  title: string;
}

export default function AdminHeader({ title }: Props) {
  const { user } = useAuth();
  const { toggle } = useAdminMobile();

  return (
    <header className="flex items-center justify-between px-3 sm:px-6 py-2 sm:py-4 bg-white border-b border-gray-200 shrink-0">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          onClick={toggle}
          className="p-1.5 sm:p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors md:hidden shrink-0"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-lg sm:text-xl font-semibold text-gray-800 truncate">{title}</h1>
      </div>
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        <button className="p-1.5 sm:p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors shrink-0">
          <Bell size={18} />
        </button>
        <div className="flex items-center gap-1.5 sm:gap-2 text-sm text-gray-700 min-w-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
            <User size={14} className="text-emerald-700" />
          </div>
          <span className="font-medium hidden sm:block truncate">{user?.name || "Admin"}</span>
        </div>
      </div>
    </header>
  );
}
