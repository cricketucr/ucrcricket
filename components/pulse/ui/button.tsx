import { cn } from "@pulse/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

const VARIANT_STYLES: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-accent text-pitch hover:bg-accent-dim active:bg-accent/80 focus-visible:ring-accent font-bold uppercase tracking-[0.1em]",
  secondary:
    "bg-transparent text-white border border-line hover:border-accent/50 hover:text-accent active:bg-boundary focus-visible:ring-accent/50",
  ghost: "text-muted hover:text-white hover:bg-boundary active:bg-line focus-visible:ring-line",
  danger: "bg-danger text-white hover:bg-danger/80 active:bg-danger/70 focus-visible:ring-danger",
};

export function Button({
  className,
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center px-4 py-2 text-sm font-medium transition-all duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100",
        VARIANT_STYLES[variant],
        className,
      )}
      {...props}
    />
  );
}
