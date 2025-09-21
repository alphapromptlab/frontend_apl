import * as React from "react";

import { cn } from "./utils";

const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, type, ...props }, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      data-slot="input"
      className={cn(
        "form-input flex h-9 w-full min-w-0 rounded-md px-3 py-1 text-base transition-all outline-none",
        "bg-[var(--form-input-bg)] text-[var(--form-text)]",
        "shadow-[0_1px_3px_rgba(0,0,0,0.3)]",
        "hover:bg-[var(--form-hover-bg)] hover:shadow-[0_2px_6px_rgba(0,0,0,0.4)]",
        "focus:bg-[var(--form-input-bg)] focus:shadow-[0_3px_8px_rgba(99,102,241,0.4)]",
        "placeholder:text-muted-foreground",
        "selection:bg-primary selection:text-primary-foreground",
        "file:inline-flex file:h-7 file:bg-transparent file:text-sm file:font-medium file:text-[var(--form-text)]",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:shadow-[0_3px_8px_rgba(220,38,38,0.4)]",
        "clean-font md:text-sm",
        className,
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

export { Input };