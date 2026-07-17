import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return <main id="main-content" tabIndex={-1} className="container grid min-h-screen place-items-center py-24"><div className="max-w-xl text-center"><p className="font-display text-8xl text-primary/25">404</p><h1 className="mt-4 font-display text-4xl">This page left the lab.</h1><p className="mt-4 text-muted-foreground">The resource may have moved, or the address may be incorrect.</p><Button asChild className="mt-8"><Link href="/"><ArrowLeft aria-hidden="true" className="size-4" /> Return home</Link></Button></div></main>;
}
