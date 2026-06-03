"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Tag, Package, ShoppingCart, Users,
  Ticket, Image, BarChart2, Settings, LogOut, ChevronLeft, Upload,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/categories", label: "Categories", icon: Tag },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/coupons", label: "Coupons", icon: Ticket },
  { href: "/admin/banners", label: "Banners", icon: Image },
  { href: "/admin/reports", label: "Reports", icon: BarChart2 },
  { href: "/admin/import", label: "Import", icon: Upload },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch { /* ignore network errors */ } finally {
      localStorage.removeItem("token");
      router.replace("/admin/login");
    }
  };

  return (
    <aside
      className={`flex flex-col h-screen bg-emerald-900 text-white transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      } shrink-0`}
    >
      <div className="flex items-center justify-between px-4 py-5 border-b border-emerald-700">
        {!collapsed && (
          <span className="font-bold text-lg tracking-wide">Kiddos Admin</span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded hover:bg-emerald-700 transition-colors ml-auto"
          aria-label="Toggle sidebar"
        >
          <ChevronLeft
            size={18}
            className={`transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              title={label}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                active
                  ? "bg-emerald-700 text-white"
                  : "text-emerald-100 hover:bg-emerald-800"
              }`}
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        title="Logout"
        className="flex items-center gap-3 px-4 py-4 text-sm text-emerald-200 hover:bg-emerald-800 border-t border-emerald-700 transition-colors"
      >
        <LogOut size={18} className="shrink-0" />
        {!collapsed && <span>Logout</span>}
      </button>
    </aside>
  );
}
