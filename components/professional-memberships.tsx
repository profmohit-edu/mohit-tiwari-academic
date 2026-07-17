import { ArrowUpRight, BadgeCheck, ExternalLink } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { profile } from "@/lib/content";

export function ProfessionalMemberships() {
  return (
    <section className="content-auto border-y border-border/60 bg-muted/25 py-24 sm:py-32" aria-labelledby="professional-memberships-title">
      <div className="container">
        <Reveal><SectionHeading id="professional-memberships-title" eyebrow="Academic community" title="Professional memberships and scholarly profiles" description="Professional associations and verified researcher identities across trusted academic and technical platforms." /></Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {profile.professionalMemberships.map((membership, index) => {
            const linkedProfile = membership.profileKey ? profile.profiles[membership.profileKey as keyof typeof profile.profiles] : null;
            const content = (
              <Card className="group h-full">
                <CardContent className="flex min-h-44 flex-col p-6">
                  <div className="flex items-start justify-between gap-4">
                    <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary"><BadgeCheck aria-hidden="true" className="size-4" /></span>
                    {linkedProfile?.url && <ExternalLink aria-hidden="true" className="size-4 text-muted-foreground transition-colors group-hover:text-primary" />}
                  </div>
                  <h3 className="mt-auto font-display text-2xl">{membership.label}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{membership.detail}</p>
                </CardContent>
              </Card>
            );
            return linkedProfile?.url ? (
              <Reveal key={membership.label} delay={index * .04}>
                <a href={linkedProfile.url} target="_blank" rel="noreferrer" aria-label={`Open ${membership.label} profile in a new tab`} className="block h-full rounded-[1.75rem]">{content}</a>
              </Reveal>
            ) : <Reveal key={membership.label} delay={index * .04}>{content}</Reveal>;
          })}
          <Reveal delay={profile.professionalMemberships.length * .04}>
            <a href={`mailto:${profile.email}`} className="flex min-h-44 h-full flex-col justify-between rounded-[1.75rem] border border-primary/20 bg-primary p-6 text-primary-foreground shadow-[0_20px_50px_-28px_hsl(var(--primary)/.8)] transition-transform hover:-translate-y-1">
              <ArrowUpRight aria-hidden="true" className="size-5 self-end" />
              <div><p className="font-display text-2xl">Academic enquiries</p><p className="mt-2 text-sm text-primary-foreground/75">Contact Prof. Tiwari</p></div>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
