import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(({ className, type, ...props }, ref) => (
  <input type={type} className={cn("flex h-12 w-full rounded-full border border-border bg-background px-5 py-2 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary/60 focus:ring-4 focus:ring-primary/10 disabled:opacity-50", className)} ref={ref} {...props} />
));
Input.displayName = "Input";
export { Input };
