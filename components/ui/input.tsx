import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  const baseStyles = cn(
    "transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
    className
  );

  const typeStyles =
    type === "checkbox"
      ? "h-4 w-4 rounded border border-input text-primary focus:ring-2 focus:ring-ring"
      : "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive";

  return (
    <input
      type={type}
      data-slot="input"
      className={cn(baseStyles, typeStyles)}
      {...props}
    />
  );
}

export { Input };