import type { ReactNode } from "react";

export default function FormGrid({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 ${className}`}>{children}</div>;
}
