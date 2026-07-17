import type { ReactNode } from "react";

export function PageShell({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <main id="main-content" tabIndex={-1} className={className}>{children}</main>;
}

export function ContentSection({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`container py-20 sm:py-28 ${className}`}>{children}</section>;
}
