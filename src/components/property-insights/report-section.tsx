
'use client';

import type { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface ReportSectionProps {
  title: string;
  isLoading: boolean;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
}

export function ReportSection({ title, isLoading, children, className, icon }: ReportSectionProps) {
  return (
    <Card className={cn('shadow-lg', className)}>
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-semibold text-primary">
          {icon && <span className="mr-2 text-accent">{icon}</span>}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-5/6" />
          </div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
}

// Helper function to format data for display
export function DataDisplay({ 
  label, 
  value, 
  unit, 
  citationNumber,
  icon 
}: { 
  label: string; 
  value: string | number | undefined | null; 
  unit?: string; 
  citationNumber?: number;
  icon?: ReactNode;
}) {
  if (value === undefined || value === null || value === '') {
    return (
      <p className="text-sm text-muted-foreground flex items-center">
        {icon}
        <span className={cn(icon ? "ml-1" : "")}>{label}: Not available</span>
      </p>
    );
  }
  return (
    <div className="mb-2 flex items-center">
      {icon}
      <span className={cn("font-medium text-foreground", icon ? "ml-1" : "")}>{label}: </span>
      <span className="text-muted-foreground ml-1">
        {typeof value === 'number' && !isNaN(value) ? value.toLocaleString() : value}
        {unit && ` ${unit}`}
        {citationNumber && <sup className="text-accent ml-1">[{citationNumber}]</sup>}
      </span>
    </div>
  );
}

// Helper for list display
export function DataListDisplay<T>({
  label,
  items,
  renderItem,
  citationNumber,
  emptyMessage = "No data available"
}: {
  label: string;
  items: T[] | undefined | null;
  renderItem: (item: T, index: number) => ReactNode;
  citationNumber?: number;
  emptyMessage?: string;
}) {
  return (
    <div className="mb-3">
      <h4 className="font-medium text-foreground mb-1">
        {label}
        {citationNumber && <sup className="text-accent ml-1">[{citationNumber}]</sup>}
      </h4>
      {items && items.length > 0 ? (
        <ul className="list-disc list-inside pl-2 space-y-1 text-sm text-muted-foreground">
          {items.map((item, index) => (
            <li key={index}>{renderItem(item, index)}</li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground italic">{emptyMessage}</p>
      )}
    </div>
  );
}
