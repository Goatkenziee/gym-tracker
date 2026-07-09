"use client";
import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Dialog({ open, onClose, title, children, className }: {
  open: boolean; onClose: () => void; title?: string; children: React.ReactNode; className?: string;
}) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className={cn(
        "relative z-10 w-full max-w-lg rounded-xl border border-border/50 bg-card p-6 shadow-xl animate-scale-in",
        className,
      )}>
        {title && (
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-base font-semibold tracking-tight">{title}</h2>
            <button onClick={onClose} aria-label="Close" className="rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
