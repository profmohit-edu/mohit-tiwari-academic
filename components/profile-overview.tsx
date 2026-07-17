import { Building2, MapPin } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { Card, CardContent } from "@/components/ui/card";
import { profile } from "@/lib/content";

export function ProfileOverview() {
  return (
    <section className="content-auto container py-24 sm:py-32" aria-labelledby="current-roles-title">
      <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-16">
        <Reveal>
          <p className="eyebrow mb-4">Academic appointment</p>
          <h2 id="current-roles-title" className="font-display text-4xl leading-tight tracking-tight sm:text-5xl">Current roles</h2>
          <Card className="mt-9">
            <CardContent className="p-7 sm:p-9">
              <span className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary"><Building2 aria-hidden="true" className="size-5" /></span>
              <p className="mt-8 font-display text-3xl leading-tight">{profile.designation}</p>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{profile.department}</p>
              <p className="mt-2 font-medium leading-relaxed">{profile.institution}</p>
              <p className="mt-5 flex items-center gap-2 text-sm text-muted-foreground"><MapPin aria-hidden="true" className="size-4 text-primary" /> New Delhi</p>
            </CardContent>
          </Card>
        </Reveal>
        <div>
          <Reveal>
            <p className="eyebrow mb-4">Areas of enquiry</p>
            <h2 className="font-display text-4xl leading-tight tracking-tight sm:text-5xl">Research interests</h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">A connected research programme spanning intelligent systems, trustworthy software, secure infrastructure, and emerging computing platforms.</p>
          </Reveal>
          <div className="mt-9 grid gap-3 sm:grid-cols-2">
            {profile.researchAreas.map((interest, index) => (
              <Reveal key={interest} delay={index * .04}>
                <div className="group flex min-h-24 items-center gap-4 rounded-2xl border border-border/70 bg-card/60 px-5 py-4 transition-colors hover:border-primary/30">
                  <span aria-hidden="true" className="font-display text-xl text-primary">{String(index + 1).padStart(2, "0")}</span>
                  <h3 className="font-display text-xl leading-tight">{interest}</h3>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
