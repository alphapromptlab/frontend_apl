import * as React from "react";

import { cn } from "./utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      data-slot="textarea"
      className={cn(
        "form-input flex field-sizing-content min-h-16 w-full rounded-md px-3 py-2 text-base transition-all outline-none resize-none",
        "bg-[var(--form-input-bg)] text-[var(--form-text)]",
        "shadow-[0_1px_3px_rgba(0,0,0,0.3)]",
        "hover:bg-[var(--form-hover-bg)] hover:shadow-[0_2px_6px_rgba(0,0,0,0.4)]",
        "focus:bg-[var(--form-input-bg)] focus:shadow-[0_3px_8px_rgba(99,102,241,0.4)]",
        "placeholder:text-muted-foreground",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:shadow-[0_3px_8px_rgba(220,38,38,0.4)]",
        "md:text-sm",
        className,
      )}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";

export { Textarea };