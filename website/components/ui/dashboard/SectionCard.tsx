import { ReactNode } from "react";
import clsx from "clsx";

interface SectionCardProps {
  children: ReactNode;
  className?: string;
}

export default function SectionCard({
  children,
  className,
}: SectionCardProps) {
  return (
    <section
      className={clsx(
        "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200",
        "hover:shadow-md",
        className
      )}
    >
      {children}
    </section>
  );
}