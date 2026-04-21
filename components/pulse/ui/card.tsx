import { cn } from "@pulse/lib/utils";

type CardProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "border border-line bg-crease p-4",
        className,
      )}
      {...props}
    />
  );
}
