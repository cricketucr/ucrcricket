import { cn } from "@pulse/lib/utils";

type CardProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-sm",
        className,
      )}
      {...props}
    />
  );
}
