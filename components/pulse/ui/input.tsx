import { cn } from "@pulse/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-slate-600 focus:ring-2 focus:ring-slate-700",
        className,
      )}
      {...props}
    />
  );
}
