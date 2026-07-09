import * as React from 'react';
import { cn } from '@/lib/utils';

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
    size?: 'sm' | 'md' | 'lg';
  }
>(({ className, variant = 'primary', size = 'md', ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-all rounded-lg select-none',
        'disabled:opacity-20 disabled:pointer-events-none',
        // variant
        variant === 'primary' && 'bg-foreground text-background hover:opacity-90 active:scale-[0.98]',
        variant === 'secondary' && 'bg-muted/60 text-foreground/70 hover:bg-muted active:scale-[0.98]',
        variant === 'ghost' && 'text-foreground/60 hover:text-foreground/80 hover:bg-muted/50 active:scale-[0.98]',
        variant === 'danger' && 'bg-destructive/10 text-destructive hover:bg-destructive/20 active:scale-[0.98]',
        variant === 'outline' && 'border border-border/60 text-foreground/70 hover:bg-muted/50 hover:border-foreground/30 active:scale-[0.98]',
        // size
        size === 'sm' && 'h-8 px-3 text-xs gap-1.5',
        size === 'md' && 'h-9 px-4 text-sm gap-2',
        size === 'lg' && 'h-10 px-5 text-sm gap-2',
        className,
      )}
      {...props}
    />
  );
});
Button.displayName = 'Button';

export { Button };
