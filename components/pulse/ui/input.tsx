import { cn } from "@pulse/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "w-full border border-line bg-boundary px-3 py-2 text-sm text-white placeholder:text-muted outline-none transition-all duration-200 focus:border-accent/50 focus:ring-1 focus:ring-accent/30",
        className,
      )}
      {...props}
    />
  );
}
