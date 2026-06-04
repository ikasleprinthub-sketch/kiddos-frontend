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
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={toggle}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors md:hidden"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
          <Bell size={18} />
        </button>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
            <User size={14} className="text-emerald-700" />
          </div>
          <span className="font-medium hidden sm:block">{user?.name || "Admin"}</span>
        </div>
      </div>
    </header>
  );
}
