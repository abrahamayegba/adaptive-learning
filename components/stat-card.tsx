import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: { value: string; positive: boolean };
  className?: string;
  accent?: boolean;
}

export function StatCard({ label, value, icon, trend, className, accent }: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-5 flex items-start gap-4 shadow-sm",
        accent && "bg-primary border-primary",
        className
      )}
    >
      <div className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
        accent ? "bg-primary-foreground/10 text-primary-foreground" : "bg-primary/10 text-primary"
      )}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn("text-sm font-medium", accent ? "text-primary-foreground/80" : "text-muted-foreground")}>
          {label}
        </p>
        <p className={cn("text-2xl font-bold leading-tight mt-0.5", accent ? "text-primary-foreground" : "text-foreground")}>
          {value}
        </p>
        {trend && (
          <p className={cn(
            "text-xs mt-1",
            accent
              ? "text-primary-foreground/70"
              : trend.positive ? "text-green-600" : "text-destructive"
          )}>
            {trend.positive ? "↑" : "↓"} {trend.value}
          </p>
        )}
      </div>
    </div>
  );
}
