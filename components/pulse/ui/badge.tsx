import { cn } from "@pulse/lib/utils";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "success" | "warning" | "danger";
};

const VARIANT_STYLES: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "bg-slate-800 text-slate-300",
  success: "bg-emerald-900/60 text-emerald-400",
  warning: "bg-amber-900/60 text-amber-400",
  danger: "bg-red-900/60 text-red-400",
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
        VARIANT_STYLES[variant],
        className,
      )}
      {...props}
    />
  );
}
