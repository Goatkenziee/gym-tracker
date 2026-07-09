import * as React from 'react';
import { cn } from '@/lib/utils';

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'flex h-9 w-full rounded-lg border border-border/60 bg-transparent px-3 py-1 text-sm',
        'file:border-0 file:bg-transparent file:text-sm file:font-medium',
        'placeholder:text-muted-foreground/20',
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20',
        'disabled:cursor-not-allowed disabled:opacity-20',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = 'Input';

const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement> & { required?: boolean }
>(({ className, children, required, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      'text-xs font-medium text-foreground/60',
      required && "after:content-['*'] after:ml-0.5 after:text-destructive/60",
      className
    )}
    {...props}
  >
    {children}
  </label>
));
Label.displayName = 'Label';

export { Input, Label };
