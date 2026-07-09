import * as React from 'react';
import { cn } from '@/lib/utils';

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'w-full bg-transparent text-sm text-foreground/80 placeholder:text-muted-foreground/20',
        'border border-border/60 rounded-lg px-3 h-9',
        'focus:outline-none focus:border-foreground/30 focus:ring-0',
        'transition-colors',
        'disabled:opacity-20 disabled:pointer-events-none',
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = 'Input';

const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        'text-xs font-medium text-foreground/60',
        className,
      )}
      {...props}
    />
  ),
);
Label.displayName = 'Label';

export { Input, Label };
