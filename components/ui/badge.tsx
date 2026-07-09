import * as React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: 'neutral' | 'success' | 'warning' | 'danger';
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, tone = 'neutral', children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium',
          tone === 'neutral' && 'bg-muted/60 text-muted-foreground/20',
          tone === 'success' && 'bg-success/10 text-success',
          tone === 'warning' && 'bg-warning/10 text-warning',
          tone === 'danger' && 'bg-destructive/10 text-destructive',
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);
Badge.displayName = 'Badge';

export { Badge };
