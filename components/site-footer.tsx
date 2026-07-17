import { BookOpen, Github, Linkedin, Mail } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { footerNavigation } from "@/lib/navigation";
import { siteConfig } from "@/lib/site";

const profiles = [
  { label: "GitHub", href: siteConfig.profiles.github.url, icon: Github },
  { label: "LinkedIn", href: siteConfig.profiles.linkedin.url, icon: Linkedin },
  { label: "ORCID", href: siteConfig.profiles.orcid.url, icon: BookOpen },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-muted/25">
      <div className="container grid gap-12 py-14 lg:grid-cols-[1fr_1.2fr]">
        <div><Link href="/" className="font-display text-2xl">{siteConfig.name}</Link><p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">{siteConfig.designation}, {siteConfig.department}, {siteConfig.institution}, New Delhi.</p><div className="mt-5 flex gap-1">{profiles.map(({ label, href, icon: Icon }) => <Button key={label} asChild variant="ghost" size="icon"><a href={href} target="_blank" rel="noreferrer" aria-label={`${label} profile`}><Icon aria-hidden="true" className="size-4" /></a></Button>)}<Button asChild variant="ghost" size="icon"><a href={`mailto:${siteConfig.email}`} aria-label={`Email ${siteConfig.name}`}><Mail aria-hidden="true" className="size-4" /></a></Button></div></div>
        <nav aria-label="Footer navigation" className="grid gap-8 sm:grid-cols-3">{footerNavigation.map((group) => <div key={group.title}><h2 className="text-xs font-bold uppercase tracking-[.18em] text-foreground">{group.title}</h2><ul className="mt-4 space-y-3 text-sm">{group.links.map(({ label, href }) => <li key={href}><Link href={href} className="text-muted-foreground transition-colors hover:text-primary">{label}</Link></li>)}</ul></div>)}</nav>
      </div>
      <div className="border-t border-border"><div className="container flex flex-col gap-2 py-5 text-xs text-muted-foreground sm:flex-row sm:justify-between"><span>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</span><span>{siteConfig.location}</span></div></div>
    </footer>
  );
}
