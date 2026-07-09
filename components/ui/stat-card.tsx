import * as React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({ label, value, delta, up, icon }: {
  label: string; value: string; delta?: string; up?: boolean; icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-4 shadow-[0_1px_2px_rgba(0,0,0,0.2)] animate-fade-up">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-muted-foreground/70 uppercase tracking-wider">{label}</span>
        {icon && <span className="text-muted-foreground/50">{icon}</span>}
      </div>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-semibold tracking-tight tabular-nums text-foreground">{value}</span>
        {delta && (
          <span className={cn(
            "flex items-center gap-0.5 text-xs font-medium",
            up ? "text-success" : "text-destructive",
          )}>
            {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {delta}
          </span>
        )}
      </div>
    </div>
  );
}
