import type { HTMLAttributes, ReactNode } from "react";

export function PageContainer({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

export function ResponsiveGrid({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 ${className}`}>{children}</div>;
}

export function ResponsiveTable({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`w-full overflow-x-auto overscroll-contain rounded-lg ${className}`} {...props} />;
}
