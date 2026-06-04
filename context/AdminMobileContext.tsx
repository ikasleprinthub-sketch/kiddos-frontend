"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface AdminMobileCtxType {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
}

const AdminMobileCtx = createContext<AdminMobileCtxType>({
  isOpen: false,
  toggle: () => {},
  close: () => {},
});

export function AdminMobileProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <AdminMobileCtx.Provider
      value={{
        isOpen,
        toggle: () => setIsOpen((v) => !v),
        close: () => setIsOpen(false),
      }}
    >
      {children}
    </AdminMobileCtx.Provider>
  );
}

export const useAdminMobile = () => useContext(AdminMobileCtx);
