import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ChevronLeft } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  backHref?: string;
}

export function PageHeader({ title, description, actions, backHref }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 pt-6 pb-2">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          {backHref && (
            <Link
              href={backHref}
              className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground/30 hover:text-foreground/60 hover:bg-muted/50 transition-all -ml-1"
            >
              <ChevronLeft className="h-4 w-4" />
            </Link>
          )}
          <h1 className="text-lg font-semibold text-foreground/90 tracking-tight truncate">{title}</h1>
        </div>
        {description && (
          <p className="text-xs text-muted-foreground/30 mt-0.5 ml-1">{description}</p>
        )}
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </div>
  );
}
