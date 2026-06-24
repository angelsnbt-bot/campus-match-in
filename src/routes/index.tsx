import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Users, Heart, BookOpen, Trophy, Code2, PartyPopper, Sparkles,
  ShieldCheck, GraduationCap, ArrowRight, Check, Loader2,
} from "lucide-react";

import heroBg from "@/assets/hero-bg.jpg";
import { submitWaitlist, getWaitlistCount } from "@/lib/waitlist.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CampusMatch — Early Access Waitlist" },
      { name: "description", content: "Verified college-only network for friends, dating, study partners, sports teams, hackathons & events. Join the founding members." },
      { property: "og:title", content: "CampusMatch — Early Access Waitlist" },
      { property: "og:description", content: "Verified college-only network. Join the early access waitlist and become a Founding Member." },
    ],
  }),
  component: LandingPage,
});

const LOOKING_FOR = [
  "Friends", "Dating", "Study Partners", "Sports Partners",
  "Hackathon Team", "Competition Team", "Event Buddies",
] as const;

const FEATURES = [
  { icon: Users, title: "Find Friends", desc: "Discover students from your branch & year." },
  { icon: Heart, title: "Dating Mode", desc: "Verified matches, mutual likes only." },
  { icon: BookOpen, title: "Study Partners", desc: "Form study groups for DSA, exams & more." },
  { icon: Trophy, title: "Sports Teams", desc: "Cricket, football, badminton, chess." },
  { icon: Code2, title: "Hackathon Squads", desc: "Find frontend, backend, designers fast." },
  { icon: PartyPopper, title: "Event Buddies", desc: "Freshers, fests, parties — never go alone." },
];

function LandingPage() {
  const { data } = useQuery({
    queryKey: ["waitlist-count"],
    queryFn: () => getWaitlistCount(),
    staleTime: 30_000,
  });
  const count = data?.count ?? 0;
  const colleges = data?.colleges ?? 0;

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Hero glow background */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[900px] opacity-60"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
          maskImage: "linear-gradient(to bottom, black 0%, black 50%, transparent 100%)",
        }}
      />

      <Nav />

      <main className="mx-auto max-w-6xl px-5 pb-24 sm:px-8">
        <Hero count={count} colleges={colleges} />
        <Features />
        <WaitlistSection />
        <FoundingMember />
      </main>

      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-5 py-6 sm:px-8">
      <div className="flex items-center gap-2 font-display text-xl font-bold">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-brand shadow-glow">
          <Sparkles className="h-4 w-4 text-white" />
        </span>
        CampusMatch
      </div>
      <div className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex">
        <ShieldCheck className="h-4 w-4 text-pink" />
        ERP-verified students only
      </div>
    </header>
  );
}

function Hero({ count, colleges }: { count: number; colleges: number }) {
  return (
    <section className="relative pt-12 pb-20 text-center sm:pt-20">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto inline-flex items-center gap-2 rounded-full border border-border glass px-4 py-1.5 text-xs font-medium"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pink opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-pink" />
        </span>
        Pre-launch · Founding Member access
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.05 }}
        className="mx-auto mt-6 max-w-4xl text-5xl font-bold leading-[1.05] sm:text-7xl"
      >
        Your <span className="text-gradient">whole campus,</span><br />
        one verified app.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg"
      >
        Friends · Dating · Study Partners · Sports Teams · Hackathon Squads · Event Buddies.
        Every profile is verified by ERP number — only real students from your college.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="mt-9 flex flex-col items-center gap-4"
      >
        <Button
          size="lg"
          onClick={() => document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" })}
          className="h-12 rounded-full bg-gradient-brand px-7 text-base font-semibold shadow-glow transition hover:opacity-95 hover:shadow-glow-violet"
        >
          Join the waitlist
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>

        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <div>
            <span className="font-semibold text-foreground">{count.toLocaleString()}</span> students joined
          </div>
          <div className="h-4 w-px bg-border" />
          <div>
            <span className="font-semibold text-foreground">{colleges}</span> colleges
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function Features() {
  return (
    <section className="py-16">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="glass group relative overflow-hidden rounded-2xl p-6 transition hover:border-pink/40"
          >
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-brand shadow-glow">
              <f.icon className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold">{f.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function FoundingMember() {
  return (
    <section className="py-12">
      <div className="glass relative overflow-hidden rounded-3xl p-8 text-center sm:p-12">
        <div className="absolute inset-0 -z-10 opacity-50" style={{ background: "var(--gradient-radial)" }} />
        <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-gradient-brand px-4 py-1.5 text-xs font-semibold text-white shadow-glow">
          <Sparkles className="h-3.5 w-3.5" />
          Founding Member Program
        </div>
        <h2 className="mt-5 text-3xl font-bold sm:text-4xl">Get the founder badge.<br className="hidden sm:block" /> Forever.</h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Everyone on the waitlist gets early access, a verified Founding Member badge on their profile,
          and lifetime priority on new features when CampusMatch goes live.
        </p>
        <ul className="mx-auto mt-6 grid max-w-md gap-2 text-left text-sm">
          {["Early access before public launch", "Founding Member badge on profile", "Priority verification", "Free forever for waitlist members"].map((p) => (
            <li key={p} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-pink" /> {p}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border py-10 text-center text-xs text-muted-foreground">
      <p>© {new Date().getFullYear()} CampusMatch · Made for students, verified for students.</p>
    </footer>
  );
}

function WaitlistSection() {
  return (
    <section id="waitlist" className="scroll-mt-20 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold sm:text-4xl">Join the <span className="text-gradient">waitlist</span></h2>
        <p className="mt-3 text-muted-foreground">
          We're verifying every student through ERP number to keep this 100% real.
        </p>
      </div>
      <div className="mx-auto mt-8 max-w-2xl">
        <WaitlistForm />
      </div>
    </section>
  );
}

function WaitlistForm() {
  const router = useRouter();
  const submit = useServerFn(submitWaitlist);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", erp_number: "", college: "", branch: "", year: "", instagram: "",
  });
  const [lookingFor, setLookingFor] = useState<string[]>([]);
  const [confirm, setConfirm] = useState(false);

  const toggleLF = (v: string) =>
    setLookingFor((cur) => (cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v]));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!confirm) return toast.error("Please confirm your ERP is correct.");
    if (lookingFor.length === 0) return toast.error("Select at least one thing you're looking for.");
    setSubmitting(true);
    try {
      await submit({
        data: {
          ...form,
          looking_for: lookingFor as never,
          confirm: true,
        },
      });
      setDone(true);
      toast.success("You're on the list! 🎉");
      router.invalidate();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass rounded-3xl p-10 text-center"
      >
        <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-brand shadow-glow">
          <Check className="h-7 w-7 text-white" />
        </div>
        <h3 className="text-2xl font-bold">You're in.</h3>
        <p className="mt-2 text-muted-foreground">
          Welcome, Founding Member. We'll email you the moment CampusMatch goes live on your campus.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="glass space-y-5 rounded-3xl p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" required>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required maxLength={80} placeholder="Arpit Kumar" />
        </Field>
        <Field label="Email" required>
          <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required maxLength={160} placeholder="you@college.edu" />
        </Field>
        <Field label="College" required>
          <Input value={form.college} onChange={(e) => setForm({ ...form, college: e.target.value })} required maxLength={160} placeholder="Vivekananda Global University" />
        </Field>
        <Field label="ERP Number" required hint="Must be unique. One ERP = one account.">
          <Input value={form.erp_number} onChange={(e) => setForm({ ...form, erp_number: e.target.value })} required maxLength={40} placeholder="44963" />
        </Field>
        <Field label="Branch" required>
          <Input value={form.branch} onChange={(e) => setForm({ ...form, branch: e.target.value })} required maxLength={80} placeholder="CSE" />
        </Field>
        <Field label="Year" required>
          <select
            value={form.year}
            onChange={(e) => setForm({ ...form, year: e.target.value })}
            required
            className="flex h-10 w-full rounded-md border border-input bg-background/40 px-3 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring"
          >
            <option value="">Select year</option>
            {["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year", "Postgrad"].map((y) => <option key={y}>{y}</option>)}
          </select>
        </Field>
        <Field label="Instagram (optional)">
          <Input value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} maxLength={60} placeholder="@yourhandle" />
        </Field>
      </div>

      <div>
        <Label className="mb-2 block">I'm looking for <span className="text-pink">*</span></Label>
        <div className="flex flex-wrap gap-2">
          {LOOKING_FOR.map((opt) => {
            const active = lookingFor.includes(opt);
            return (
              <button
                type="button"
                key={opt}
                onClick={() => toggleLF(opt)}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-sm font-medium transition",
                  active
                    ? "border-transparent bg-gradient-brand text-white shadow-glow"
                    : "border-border bg-background/40 text-muted-foreground hover:border-pink/40 hover:text-foreground",
                )}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      <label className="flex items-start gap-3 rounded-xl border border-border bg-background/30 p-3 text-sm">
        <Checkbox checked={confirm} onCheckedChange={(v) => setConfirm(v === true)} className="mt-0.5" />
        <span className="text-muted-foreground">
          I confirm I'm a student of my college and my <span className="font-medium text-foreground">ERP Number is correct.</span>
        </span>
      </label>

      <Button
        type="submit"
        disabled={submitting}
        size="lg"
        className="h-12 w-full rounded-full bg-gradient-brand text-base font-semibold shadow-glow hover:opacity-95"
      >
        {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : (<>Join Waitlist <GraduationCap className="ml-1 h-5 w-5" /></>)}
      </Button>
    </form>
  );
}

function Field({ label, hint, required, children }: { label: string; hint?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label} {required && <span className="text-pink">*</span>}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
