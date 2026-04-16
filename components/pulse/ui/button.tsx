import { cn } from "@pulse/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

const VARIANT_STYLES: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-amber-500 text-slate-900 hover:bg-amber-400 active:bg-amber-600 focus-visible:ring-amber-400",
  secondary:
    "bg-slate-800 text-white border border-slate-700 hover:bg-slate-700 active:bg-slate-600 focus-visible:ring-slate-500",
  ghost: "text-slate-300 hover:bg-slate-800 active:bg-slate-700 focus-visible:ring-slate-500",
  danger: "bg-red-600 text-white hover:bg-red-500 active:bg-red-700 focus-visible:ring-red-400",
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
        "inline-flex cursor-pointer items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100",
        VARIANT_STYLES[variant],
        className,
      )}
      {...props}
    />
  );
}
