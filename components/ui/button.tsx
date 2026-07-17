import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-[transform,background-color,border-color,box-shadow,color,opacity] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50", {
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground shadow-[0_12px_30px_-14px_hsl(var(--primary)/.8)] hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-14px_hsl(var(--primary)/.9)] hover:brightness-105",
      outline: "border border-border/80 bg-background/65 shadow-sm backdrop-blur-xl hover:-translate-y-0.5 hover:border-primary/40 hover:bg-accent",
      ghost: "hover:bg-accent hover:text-accent-foreground"
    },
    size: { default: "h-11 px-5", sm: "h-10 px-4", icon: "size-11 p-0" }
  },
  defaultVariants: { variant: "default", size: "default" }
});

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> { asChild?: boolean }

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
});
Button.displayName = "Button";

export { Button, buttonVariants };
