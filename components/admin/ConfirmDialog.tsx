"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  /** What will happen, e.g. which item and the consequences */
  message: React.ReactNode;
  confirmLabel?: string;
  /** Runs on confirm; throw to show the error inside the dialog instead of closing it */
  onConfirm: () => Promise<void> | void;
  onCancel: () => void;
}

/** Admin-themed replacement for window.confirm() for destructive actions. */
export default function ConfirmDialog({ open, title, message, confirmLabel = "Delete", onConfirm, onCancel }: ConfirmDialogProps) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset when the dialog is reopened
    setError("");
    // Focus the safe option first, so pressing Enter doesn't delete by accident
    cancelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" && !busy) onCancel(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, busy, onCancel]);

  if (!open) return null;

  const confirm = async () => {
    setBusy(true);
    setError("");
    try {
      await onConfirm();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/45 p-4"
      onMouseDown={(e) => { if (e.target === e.currentTarget && !busy) onCancel(); }}
    >
      <div role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-message" className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600">
            <AlertTriangle size={22} />
          </span>
          <div className="min-w-0">
            <h2 id="confirm-title" className="text-lg font-extrabold text-slate-950">{title}</h2>
            <div id="confirm-message" className="mt-1.5 text-sm leading-relaxed text-slate-600">{message}</div>
          </div>
        </div>
        {error && <p role="alert" className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
        <div className="mt-6 flex justify-end gap-3">
          <button ref={cancelRef} onClick={onCancel} disabled={busy} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50">
            Cancel
          </button>
          <button onClick={confirm} disabled={busy} className="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-60">
            {busy ? "Working…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
