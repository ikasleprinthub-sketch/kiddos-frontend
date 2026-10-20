"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MoreVertical } from "lucide-react";

export interface RowAction {
  label: string;
  icon?: React.ComponentType<{ size?: number }>;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
}

/**
 * Three-dot menu for table rows. Rendered in a portal with fixed positioning so it isn't clipped
 * by the table's overflow container; closes on outside click, Escape, scroll or resize.
 */
export default function RowActionsMenu({ actions, label = "More actions" }: { actions: RowAction[]; label?: string }) {
  const [pos, setPos] = useState<{ top: number; right: number } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pos) return;
    const close = () => setPos(null);
    const onDown = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node) && !buttonRef.current?.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { close(); buttonRef.current?.focus(); } };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    menuRef.current?.querySelector<HTMLButtonElement>("button:not(:disabled)")?.focus();
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [pos]);

  const toggle = () => {
    if (pos) return setPos(null);
    const r = buttonRef.current!.getBoundingClientRect();
    const menuHeight = actions.length * 40 + 12;
    // Open upwards when there isn't room below
    const top = r.bottom + 4 + menuHeight > window.innerHeight ? Math.max(8, r.top - 4 - menuHeight) : r.bottom + 4;
    setPos({ top, right: window.innerWidth - r.right });
  };

  return (
    <>
      <button
        ref={buttonRef}
        onClick={toggle}
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={!!pos}
        className={`rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 ${pos ? "bg-slate-100 text-slate-800" : ""}`}
      >
        <MoreVertical size={17} />
      </button>
      {pos && createPortal(
        <div ref={menuRef} role="menu" style={{ top: pos.top, right: pos.right }} className="fixed z-50 min-w-48 overflow-hidden rounded-xl border border-slate-200 bg-white py-1.5 shadow-xl">
          {actions.map((a) => (
            <button
              key={a.label}
              role="menuitem"
              disabled={a.disabled}
              onClick={() => { setPos(null); a.onClick(); }}
              className={`flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${a.danger ? "text-rose-600 hover:bg-rose-50" : "text-slate-700 hover:bg-slate-50"}`}
            >
              {a.icon && <a.icon size={15} />}
              {a.label}
            </button>
          ))}
        </div>,
        document.body
      )}
    </>
  );
}
