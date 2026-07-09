import * as React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: 'default' | 'outline' | 'success' | 'warning';
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, tone = 'default', ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium leading-4',
        tone === 'default' && 'bg-foreground/8 text-foreground/60',
        tone === 'outline' && 'border border-border/60 text-foreground/50',
        tone === 'success' && 'bg-success/10 text-success',
        tone === 'warning' && 'bg-warning/10 text-warning',
        className,
      )}
      {...props}
    />
  ),
);
Badge.displayName = 'Badge';

export { Badge };
