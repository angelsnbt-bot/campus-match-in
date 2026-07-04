import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Users, Heart, BookOpen, Trophy, Code2, PartyPopper, Sparkles,
  ShieldCheck, GraduationCap, ArrowRight, Check, Loader2, UserCheck,
  ListChecks, UserPlus, Search, Dumbbell, Music, Gamepad2, Camera,
  Palette, Plane, Coffee, ChevronDown,
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
      { title: "CampusMatch — Pre-launch at VGU · Founding Member access" },
      { name: "description", content: "CampusMatch is launching at Vivekananda Global University. Friends, dating, study partners, sports teams, hackathon squads — all verified by ERP. Join the first 100 founding members." },
      { property: "og:title", content: "CampusMatch — Pre-launch at VGU" },
      { property: "og:description", content: "Verified college-only network launching at Vivekananda Global University. Become a Founding Member." },
    ],
  }),
  component: LandingPage,
});

const LOOKING_FOR = [
  "Friends", "Dating", "Study Partners", "Sports Partners",
  "Hackathon Team", "Competition Team", "Event Buddies", "Communities",
] as const;

const SPORTS_OPTIONS = ["Cricket", "Football", "Badminton", "Basketball", "Volleyball", "Table Tennis", "Chess", "Gym", "Running"];
const INTEREST_OPTIONS = ["Coding", "Music", "Gaming", "Photography", "Art", "Travel", "Anime", "Movies", "Reading", "Startups", "Dance", "Coffee"];
const GENDERS = ["Male", "Female", "Non-binary", "Prefer not to say"] as const;

const FEATURES = [
  { icon: Users, title: "Find Friends", desc: "Discover students from your branch & year." },
  { icon: Heart, title: "Dating Mode", desc: "Verified matches, mutual likes only. Fully optional." },
  { icon: BookOpen, title: "Study Partners", desc: "Form study groups for DSA, exams & projects." },
  { icon: Trophy, title: "Sports Teams", desc: "Cricket, football, badminton, chess & more." },
  { icon: Code2, title: "Hackathon Squads", desc: "Find frontend, backend, designers fast." },
  { icon: PartyPopper, title: "Event Buddies", desc: "Freshers, fests, parties — never go alone." },
];

const TEAM_USE_CASES = [
  { icon: Trophy, title: "Need 2 football players?", desc: "Post your team, get matched with players from your campus." },
  { icon: Code2, title: "Need a frontend developer?", desc: "Find hackathon teammates by skill, not by luck." },
  { icon: Dumbbell, title: "Need a badminton doubles partner?", desc: "Match by skill level & availability." },
  { icon: Sparkles, title: "Need teammates for SIH?", desc: "Build a balanced Smart India Hackathon squad." },
];

const SPORTS_FEATURES = [
  "Create Football Teams",
  "Find Cricket Players",
  "Find Badminton Partners",
  "Recruit Hackathon Teammates",
  "Build Competition Teams",
];

const COMMUNITIES = [
  { name: "Software Engineering", icon: Code2 },
  { name: "First Year Students", icon: GraduationCap },
  { name: "Gym Lovers", icon: Dumbbell },
  { name: "Cricket Club", icon: Trophy },
  { name: "Startup Founders", icon: Sparkles },
  { name: "Music & Jam", icon: Music },
  { name: "Gaming Squad", icon: Gamepad2 },
  { name: "Photography", icon: Camera },
  { name: "Art & Design", icon: Palette },
  { name: "Travel Buddies", icon: Plane },
  { name: "Coffee & Chill", icon: Coffee },
];

const HOW_IT_WORKS = [
  { icon: UserPlus, title: "Join Waitlist", desc: "Drop your details. Takes 30 seconds." },
  { icon: ShieldCheck, title: "Verify with ERP", desc: "One ERP = one account. No fakes, no bots." },
  { icon: UserCheck, title: "Create Profile", desc: "Add interests, sports & what you're looking for." },
  { icon: Search, title: "Match & Connect", desc: "Friends, dates, teammates, study partners — your call." },
];

const FAQS = [
  { q: "How does ERP verification work?", a: "When the app launches, you'll log in with your ERP number. We check it against our verified college roster, so every profile is a real student. One ERP = one account, forever." },
  { q: "Can non-VGU students join?", a: "Not yet. We're launching at Vivekananda Global University first to build a dense, real community. Other colleges roll out next — join the waitlist so we know to launch on your campus." },
  { q: "Is Dating optional?", a: "100%. You pick what you're looking for — Friends, Study Partners, Sports, Hackathons, Events or Dating. Hide dating mode entirely if you don't want it." },
  { q: "Can I use CampusMatch only for friends?", a: "Yes. Many users will never touch dating mode. The app is designed to be useful even if you only want study partners, sports teammates or club friends." },
  { q: "Is my ERP Number public?", a: "Never. Your ERP is used only for verification on our backend. It is never shown on your profile or to other users." },
];

function LandingPage() {
  const { data } = useQuery({
    queryKey: ["waitlist-count"],
    queryFn: () => getWaitlistCount(),
    staleTime: 30_000,
  });
  const count = data?.count ?? 0;

  return (
    <div className="relative min-h-screen overflow-x-hidden">
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
        <Hero count={count} />
        <Features />
        <HowItWorks />
        <ProfilePreview />
        <SportsAndTeams />
        <FindYourTeam />
        <Communities />
        <WaitlistSection />
        <FoundingMember />
        <FAQ />
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

function Hero({ count }: { count: number }) {
  const showCounter = count >= 20;
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
        Pre-launch at VGU · Founding Member access
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
        Currently launching at <span className="font-semibold text-foreground">Vivekananda Global University (VGU)</span>.
        Friends · Dating · Study Partners · Sports Teams · Hackathon Squads · Events & Trips — all verified by ERP.
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
          Become a Founding Member
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>

        <p className="text-sm text-muted-foreground">
          {showCounter
            ? <><span className="font-semibold text-foreground">{count.toLocaleString()}</span> VGU students already joined</>
            : <>Be one of the first <span className="font-semibold text-foreground">100 founding members</span> at VGU</>}
        </p>
      </motion.div>
    </section>
  );
}

function Features() {
  return (
    <section className="py-16">
      <SectionTitle eyebrow="What you can do" title="One app, every campus connection." />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

function HowItWorks() {
  return (
    <section className="py-16">
      <SectionTitle eyebrow="How it works" title="From signup to your first match in minutes." />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {HOW_IT_WORKS.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="glass relative rounded-2xl p-6"
          >
            <div className="absolute right-4 top-4 font-display text-3xl font-bold text-gradient opacity-60">
              {i + 1}
            </div>
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-brand shadow-glow">
              <s.icon className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-base font-semibold">{s.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function ProfilePreview() {
  return (
    <section className="py-16">
      <SectionTitle eyebrow="Sneak peek" title="This is what a CampusMatch profile looks like." />
      <div className="mt-10 grid items-center gap-8 lg:grid-cols-2">
        <div className="mx-auto w-full max-w-sm">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass relative overflow-hidden rounded-3xl p-6 shadow-glow"
          >
            <div className="mb-5 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-brand font-display text-2xl font-bold text-white shadow-glow">
                P
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xl font-bold">Priya</h3>
                  <span className="inline-flex items-center gap-1 rounded-full bg-pink/15 px-2 py-0.5 text-[10px] font-semibold text-pink">
                    <ShieldCheck className="h-3 w-3" /> ERP Verified
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">CSE • 1st Year • VGU</p>
              </div>
            </div>
            <div className="mb-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Interests</p>
              <div className="flex flex-wrap gap-1.5">
                {["Coding", "Badminton", "Music"].map((t) => (
                  <span key={t} className="rounded-full border border-border bg-background/40 px-2.5 py-1 text-xs">{t}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Looking for</p>
              <div className="flex flex-wrap gap-1.5">
                {["Friends", "Dating", "Sports Partner"].map((t) => (
                  <span key={t} className="rounded-full bg-gradient-brand px-2.5 py-1 text-xs font-medium text-white shadow-glow">{t}</span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
        <div>
          <h3 className="font-display text-2xl font-bold sm:text-3xl">Real students. Real interests. Real intent.</h3>
          <p className="mt-3 text-muted-foreground">
            Every profile shows what someone actually wants — friends, study partners, a date, a teammate.
            No swiping in the dark, no fake accounts. Just verified students from your own campus.
          </p>
          <ul className="mt-6 space-y-2 text-sm">
            {["ERP-verified badge on every profile", "Filter by interest, branch & year", "Choose multiple modes — or just one"].map((p) => (
              <li key={p} className="flex items-center gap-2"><Check className="h-4 w-4 text-pink" /> {p}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function SportsAndTeams() {
  return (
    <section className="py-16">
      <SectionTitle eyebrow="Sports & teams" title="Way more than dating." />
      <div className="mt-8 glass rounded-3xl p-6 sm:p-8">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SPORTS_FEATURES.map((s) => (
            <div key={s} className="flex items-center gap-3 rounded-xl border border-border bg-background/30 p-4">
              <div className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-brand shadow-glow">
                <Trophy className="h-4 w-4 text-white" />
              </div>
              <span className="font-medium">{s}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FindYourTeam() {
  return (
    <section className="py-16">
      <SectionTitle
        eyebrow="The killer feature"
        title="Find Your Team."
        subtitle="Tinder, Bumble and Instagram don't solve this. CampusMatch does."
      />
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {TEAM_USE_CASES.map((t, i) => (
          <motion.div
            key={t.title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="glass rounded-2xl p-6"
          >
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-brand shadow-glow">
              <t.icon className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold">{t.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Communities() {
  return (
    <section className="py-16">
      <SectionTitle eyebrow="Communities" title="Join your people on campus." />
      <div className="mt-8 flex flex-wrap justify-center gap-2.5">
        {COMMUNITIES.map((c) => (
          <div key={c.name} className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition hover:border-pink/40">
            <c.icon className="h-4 w-4 text-pink" />
            <span className="font-medium">{c.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function FoundingMember() {
  const perks = [
    "Founder Badge on your profile",
    "Early Access before public launch",
    "Priority Verification",
    "Special Profile Badge forever",
  ];
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
          Limited to the first <span className="font-semibold text-foreground">100 students at VGU</span>.
          Lifetime priority on everything we ship.
        </p>
        <ul className="mx-auto mt-6 grid max-w-md gap-2 text-left text-sm">
          {perks.map((p) => (
            <li key={p} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-pink" /> {p}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function FAQ() {
  return (
    <section className="py-16">
      <SectionTitle eyebrow="FAQ" title="Quick answers." />
      <div className="mx-auto mt-8 max-w-2xl space-y-3">
        {FAQS.map((item) => (
          <details key={item.q} className="glass group rounded-2xl p-5 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
              {item.q}
              <ChevronDown className="h-4 w-4 shrink-0 text-pink transition group-open:rotate-180" />
            </summary>
            <p className="mt-3 text-sm text-muted-foreground">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border py-10 text-center text-xs text-muted-foreground">
      <p>© {new Date().getFullYear()} CampusMatch · Launching at Vivekananda Global University.</p>
    </footer>
  );
}

function SectionTitle({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <div className="text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pink">{eyebrow}</p>
      <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">{title}</h2>
      {subtitle && <p className="mx-auto mt-3 max-w-xl text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

function WaitlistSection() {
  return (
    <section id="waitlist" className="scroll-mt-20 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pink">Founding Members</p>
        <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Join the <span className="text-gradient">waitlist</span></h2>
        <p className="mt-3 text-muted-foreground">
          Every student is verified by ERP. One ERP, one account, zero fakes.
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
    name: "", email: "", erp_number: "",
    college: "Vivekananda Global University",
    branch: "", year: "", instagram: "", gender: "", age: "",
  });
  const [lookingFor, setLookingFor] = useState<string[]>([]);
  const [sports, setSports] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [confirm, setConfirm] = useState(false);

  const toggle = (setter: React.Dispatch<React.SetStateAction<string[]>>) => (v: string) =>
    setter((cur) => (cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v]));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!confirm) return toast.error("Please confirm your ERP is correct.");
    if (lookingFor.length === 0) return toast.error("Select at least one thing you're looking for.");
    setSubmitting(true);
    try {
      await submit({
        data: {
          name: form.name,
          email: form.email,
          erp_number: form.erp_number,
          college: form.college,
          branch: form.branch,
          year: form.year,
          instagram: form.instagram,
          gender: (form.gender || "") as never,
          age: form.age ? Number(form.age) : (NaN as never),
          sports,
          interests,
          looking_for: lookingFor as never,
          confirm: true,
        },
      });
      setDone(true);
      toast.success("You're in! 🎉 Founding Member secured.");
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
          Welcome, Founding Member. We'll email you the moment CampusMatch goes live at VGU.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="glass space-y-6 rounded-3xl p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" required>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required maxLength={80} placeholder="Your full name" autoComplete="off" />
        </Field>
        <Field label="Email" required>
          <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required maxLength={160} placeholder="you@college.edu" />
        </Field>
        <Field label="College" required>
          <Input value={form.college} onChange={(e) => setForm({ ...form, college: e.target.value })} required maxLength={160} />
        </Field>
        <Field label="ERP Number" required hint="Must be unique. One ERP = one account.">
          <Input value={form.erp_number} onChange={(e) => setForm({ ...form, erp_number: e.target.value })} required maxLength={40} placeholder="44963" />
        </Field>
        <Field label="Branch" required>
          <Input value={form.branch} onChange={(e) => setForm({ ...form, branch: e.target.value })} required maxLength={80} placeholder="CSE" />
        </Field>
        <Field label="Year" required>
          <Select value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} required>
            <option value="">Select year</option>
            {["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year", "Postgrad"].map((y) => <option key={y}>{y}</option>)}
          </Select>
        </Field>
        <Field label="Gender">
          <Select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
            <option value="">Prefer not to say</option>
            {GENDERS.map((g) => <option key={g}>{g}</option>)}
          </Select>
        </Field>
        <Field label="Age">
          <Input type="number" min={15} max={60} value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} placeholder="19" />
        </Field>
        <Field label="Instagram (optional)">
          <Input value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} maxLength={60} placeholder="@yourhandle" />
        </Field>
      </div>

      <ChipGroup label="I'm looking for" required options={LOOKING_FOR as readonly string[]} value={lookingFor} onToggle={toggle(setLookingFor)} />
      <ChipGroup label="Sports you play" options={SPORTS_OPTIONS} value={sports} onToggle={toggle(setSports)} />
      <ChipGroup label="Your interests" options={INTEREST_OPTIONS} value={interests} onToggle={toggle(setInterests)} />

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
        {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : (<>Claim my Founding Member spot <GraduationCap className="ml-1 h-5 w-5" /></>)}
      </Button>

      <div className="rounded-2xl border border-pink/20 bg-pink/5 p-4 text-sm">
        <p className="mb-2 font-semibold">Founding Members get:</p>
        <ul className="grid gap-1.5 sm:grid-cols-2">
          {["Founder Badge", "Early Access", "Priority Verification", "Special Profile Badge Forever"].map((p) => (
            <li key={p} className="flex items-center gap-2 text-muted-foreground">
              <Check className="h-4 w-4 text-pink" /> {p}
            </li>
          ))}
        </ul>
      </div>
    </form>
  );
}

function ChipGroup({
  label, options, value, onToggle, required,
}: { label: string; options: readonly string[]; value: string[]; onToggle: (v: string) => void; required?: boolean }) {
  return (
    <div>
      <Label className="mb-2 block">
        {label} {required && <span className="text-pink">*</span>}
      </Label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = value.includes(opt);
          return (
            <button
              type="button"
              key={opt}
              onClick={() => onToggle(opt)}
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
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className="flex h-10 w-full rounded-md border border-input bg-background/40 px-3 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring"
    />
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

const _unused = ListChecks;
