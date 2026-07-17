"use client";

import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { siteConfig } from "@/lib/site";
import { primaryNavigation, secondaryNavigation } from "@/lib/navigation";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <div className="glass pointer-events-auto mx-auto flex h-14 max-w-[1240px] items-center justify-between rounded-2xl px-3 sm:h-16 sm:rounded-[1.35rem] sm:px-4">
        <Link href="/" className="flex items-center gap-3 font-semibold">
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-xs text-primary-foreground shadow-[0_10px_24px_-12px_hsl(var(--primary))]">{siteConfig.shortName}</span>
          <span className="hidden sm:inline">{siteConfig.name}</span>
          <span className="sr-only">, home</span>
        </Link>
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {primaryNavigation.map(({ label, href }) => <Link key={href} href={href} aria-current={isActive(href) ? "page" : undefined} className="nav-link">{label}</Link>)}
          <details key={pathname} className="nav-more relative">
            <summary className="nav-link flex cursor-pointer list-none items-center gap-1 [&::-webkit-details-marker]:hidden">
              More <ChevronDown aria-hidden="true" className="size-3.5 transition-transform group-open:rotate-180" />
            </summary>
            <div className="glass absolute right-0 top-[calc(100%+.75rem)] w-72 rounded-2xl p-2 shadow-soft">
              {secondaryNavigation.map(({ label, href, description }) => (
                <Link key={href} href={href} aria-current={isActive(href) ? "page" : undefined} className="block rounded-xl px-4 py-3 transition-colors hover:bg-accent aria-[current=page]:bg-accent">
                  <span className="block text-sm font-semibold">{label}</span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">{description}</span>
                </Link>
              ))}
            </div>
          </details>
        </nav>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Button asChild size="sm" className="hidden sm:inline-flex"><Link href="/contact">Let&apos;s connect</Link></Button>
          <Button variant="ghost" size="icon" className="lg:hidden" aria-label={open ? "Close navigation" : "Open navigation"} aria-controls="mobile-navigation" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}</Button>
        </div>
      </div>
      {open && <nav id="mobile-navigation" className="glass pointer-events-auto mx-auto mt-2 grid max-h-[calc(100svh-6rem)] max-w-[1240px] gap-1 overflow-y-auto rounded-2xl p-3 lg:hidden" aria-label="Mobile navigation">{[{ label: "Home", href: "/" }, ...primaryNavigation, ...secondaryNavigation, { label: "Contact", href: "/contact" }].map(({ label, href }) => <Link key={href} href={href} aria-current={isActive(href) ? "page" : undefined} className="rounded-xl px-4 py-3 text-sm font-medium transition-colors hover:bg-accent aria-[current=page]:bg-accent aria-[current=page]:text-primary">{label}</Link>)}</nav>}
    </header>
  );
}
