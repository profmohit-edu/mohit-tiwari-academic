import { BarChart3, BookMarked, Clock3, UsersRound } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { TeachingCourse, TeachingMetric } from "@/types/teaching";

const grouped = (values: string[]) => Object.entries(values.reduce<Record<string, number>>((counts, value) => ({ ...counts, [value]: (counts[value] ?? 0) + 1 }), {})).sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]));

function Distribution({ title, values, emptyText }: { title: string; values: Array<[string, number]>; emptyText: string }) {
  const maximum = Math.max(1, ...values.map(([, value]) => value));
  return <Card><CardContent className="p-6 sm:p-7"><h3 className="font-display text-2xl">{title}</h3>{values.length > 0 ? <ul className="mt-6 space-y-4">{values.map(([label, value]) => <li key={label}><div className="mb-2 flex items-center justify-between gap-4 text-sm"><span className="font-medium">{label}</span><span className="tabular-nums text-muted-foreground">{value}</span></div><div className="h-2 overflow-hidden rounded-full bg-muted"><span className="block h-full rounded-full bg-gradient-to-r from-primary to-violet-500" style={{ width: `${Math.max(8, value / maximum * 100)}%` }} /></div></li>)}</ul> : <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{emptyText}</p>}</CardContent></Card>;
}

export function TeachingAnalytics({ courses, metrics }: { courses: TeachingCourse[]; metrics: TeachingMetric[] }) {
  const students = metrics.find((metric) => metric.key === "studentsTaught");
  const hours = metrics.find((metric) => metric.key === "lectureHours");
  const years = grouped(courses.flatMap((course) => course.academicYear ? [course.academicYear] : []));
  const domains = grouped(courses.map((course) => course.domain));
  const programmes = grouped(courses.map((course) => course.programme));
  return <section aria-labelledby="teaching-analytics-title"><div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-2xl bg-primary/10 text-primary"><BarChart3 aria-hidden="true" className="size-5" /></span><div><p className="eyebrow">Teaching analytics</p><h2 id="teaching-analytics-title" className="mt-2 font-display text-4xl sm:text-5xl">Evidence-led teaching overview</h2></div></div><div className="mt-8 grid gap-4 sm:grid-cols-3"><Card><CardContent className="p-6"><BookMarked aria-hidden="true" className="size-5 text-primary" /><p className="mt-5 text-3xl font-semibold tabular-nums">{courses.length}</p><p className="mt-1 text-sm text-muted-foreground">Verified course and training records</p></CardContent></Card>{[[students, UsersRound], [hours, Clock3]].map(([metric, Icon]) => { const item = metric as TeachingMetric | undefined; const MetricIcon = Icon as typeof UsersRound; return <Card key={item?.key ?? "missing"}><CardContent className="p-6"><MetricIcon aria-hidden="true" className="size-5 text-primary" /><p className="mt-5 text-3xl font-semibold tabular-nums">{item?.value ?? "—"}</p><p className="mt-1 text-sm text-muted-foreground">{item?.value === null ? `${item.label} · verification pending` : `${item?.label} · ${item?.unit}`}</p></CardContent></Card>; })}</div><div className="mt-4 grid gap-4 lg:grid-cols-3"><Distribution title="Courses by year" values={years} emptyText="Academic-year assignments are awaiting verification." /><Distribution title="Subjects by domain" values={domains} emptyText="No verified domains are available." /><Distribution title="Programme distribution" values={programmes} emptyText="No verified programme assignments are available." /></div></section>;
}
