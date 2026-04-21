import { cn } from "@pulse/lib/utils";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "success" | "warning" | "danger";
};

const VARIANT_STYLES: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "border border-line text-muted",
  success: "border border-success/30 text-success bg-success/10",
  warning: "border border-pulse-warning/30 text-pulse-warning bg-pulse-warning/10",
  danger: "border border-danger/30 text-danger bg-danger/10",
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 text-xs font-semibold uppercase tracking-widest",
        VARIANT_STYLES[variant],
        className,
      )}
      {...props}
    />
  );
}
