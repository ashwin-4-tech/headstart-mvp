import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Search, FileText, Palette, BarChart3, Swords, ArrowRight, Check, Sparkles,
  IndianRupee, Globe2, MessageSquare, ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { UnitEconomics } from "@/components/UnitEconomics";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HeadStart — MVP for Powerhouse | India-first startup validation" },
      {
        name: "description",
        content:
          "Validate your startup idea with India-specific data: competitive benchmarks, unit economics for INR markets, and the Swadeshi tech stack.",
      },
      { property: "og:title", content: "HeadStart — MVP for Powerhouse" },
      { property: "og:description", content: "India-first startup validation for first-time founders." },
    ],
  }),
  component: Landing,
});

const pillars = [
  { icon: Search, title: "Research", desc: "TAM/SAM/SOM tuned for Tier 1, 2, 3 cities — not US-coastal cliches." },
  { icon: FileText, title: "Specs", desc: "Auto-generated PRDs that include UPI, COD, and DLT compliance from day one." },
  { icon: Palette, title: "Brand", desc: "Identity ideas that resonate indie — Hinglish, regional, or premium." },
  { icon: BarChart3, title: "Data", desc: "Unit economics modelled on real Indian CAC, LTV and burn benchmarks." },
  { icon: Swords, title: "Competition", desc: "Benchmarks against Indian Unicorns and the bootstrap underdogs you'll actually fight." },
];

function Landing() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <SectionDivider />
      <Pillars />
      <SectionDivider />
      <LocalContext />
      <SectionDivider />
      <CalculatorPreview />
      <SectionDivider />
      <Pricing />
      <SectionDivider />
      <Footer />
    </div>
  );
}

function SectionDivider() {
  return (
    <div className="container mx-auto px-4">
      <div className="h-px w-full bg-white/20" />
    </div>
  );
}

function Hero() {
  const navigate = useNavigate();
  return (
    <section className="relative overflow-hidden bg-gradient-hero">
      <div className="container relative mx-auto px-4 py-24 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="outline" className="mb-6 border-teal/40 bg-teal/10 text-foreground">
            <Sparkles className="mr-1.5 h-3 w-3 text-teal" /> Built for Bharat. Trained on India.
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            Turn your idea into a <span className="text-gradient">POWERHOUSE</span> — the Indian way.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground md:text-xl">
            HeadStart validates your startup with context-aware reports on Indian competitors,
            unit economics in ₹, and the indie tech stack you can actually afford.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              size="lg"
              onClick={() => navigate({ to: "/auth" })}
              className="bg-gradient-primary px-7 text-primary-foreground shadow-glow hover:opacity-90"
            >
              Start Your Journey for ₹0 <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
            <a href="#pillars">
              <Button size="lg" variant="outline">See how it works</Button>
            </a>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            No credit card. No call. Get your report in under 60 seconds.
          </p>
        </div>

        {/* Abstract preview panel */}
        <div className="relative mx-auto mt-16 max-w-4xl">
          <div className="glass rounded-2xl p-2 shadow-soft">
            <div className="rounded-xl bg-card p-5">
              <div className="mb-4 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-saffron" />
                <span className="h-2.5 w-2.5 rounded-full bg-teal" />
                <span className="ml-3 text-xs text-muted-foreground">headstart.app/dashboard</span>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <MiniStat label="TAM" value="₹48,000 Cr" tone="saffron" />
                <MiniStat label="SAM" value="₹7,200 Cr" tone="teal" />
                <MiniStat label="SOM (Yr 1)" value="₹420 Cr" tone="navy" />
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-lg border bg-muted/40 p-4">
                  <div className="text-xs uppercase text-muted-foreground">LTV : CAC</div>
                  <div className="mt-1 text-2xl font-bold text-teal">3.4x</div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-border">
                    <div className="h-full w-3/4 bg-gradient-primary" />
                  </div>
                </div>
                <div className="rounded-lg border bg-muted/40 p-4">
                  <div className="text-xs uppercase text-muted-foreground">Top Competitor</div>
                  <div className="mt-1 text-2xl font-bold">Zomato</div>
                  <div className="mt-1 text-xs text-muted-foreground">Weakness: Tier 3 burn</div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -inset-x-12 -bottom-10 h-32 bg-gradient-primary opacity-20 blur-3xl" />
        </div>
      </div>
    </section>
  );
}

function MiniStat({ label, value, tone }: { label: string; value: string; tone: "saffron" | "teal" | "navy" }) {
  const toneCls = tone === "saffron" ? "text-saffron" : tone === "teal" ? "text-teal" : "text-foreground";
  return (
    <div className="rounded-lg border bg-muted/40 p-4">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className={`mt-1 text-2xl font-bold ${toneCls}`}>{value}</div>
    </div>
  );
}

function Pillars() {
  return (
    <section id="pillars" className="container mx-auto px-4 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold md:text-4xl">The 5 Pillars of a HeadStart</h2>
        <p className="mt-4 text-muted-foreground">
          Everything a first-time Indian founder needs — in one validated report.
        </p>
      </div>
      <div className="mt-14 grid gap-5 md:grid-cols-3 lg:grid-cols-5">
        {pillars.map(({ icon: Icon, title, desc }, i) => (
          <Card
            key={title}
            className="group relative overflow-hidden border-border/60 bg-card/80 shadow-soft backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-teal/40 hover:shadow-glow"
          >
            {/* glow accent */}
            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-primary opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-30" />
            {/* top accent bar */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal/60 to-transparent opacity-60" />
            <CardContent className="relative p-6">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow ring-1 ring-white/20 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                <Icon className="h-5 w-5" />
              </div>
              <div className="mb-1 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                0{i + 1}
              </div>
              <h3 className="font-semibold tracking-tight">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function LocalContext() {
  const items = [
    { icon: IndianRupee, title: "₹ Native economics", desc: "Models built on actual Indian ARPU — not converted from $." },
    { icon: Globe2, title: "Tier 1/2/3 reality", desc: "We segment your TAM by city tier so go-to-market is realistic." },
    { icon: MessageSquare, title: "UPI & COD aware", desc: "Payment behaviors baked into every monetization recommendation." },
    { icon: ShieldCheck, title: "DLT & RBI guardrails", desc: "Compliance hints flagged before you launch, not after." },
  ];
  return (
    <section id="context" className="border-y border-border/60 bg-muted/30 py-24">
      <div className="container mx-auto px-4">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <Badge variant="outline" className="mb-4">Indie context</Badge>
            <h2 className="text-3xl font-bold md:text-4xl">
              Why HeadStart beats global AI tools for India.
            </h2>
            <p className="mt-4 text-muted-foreground">
              ChatGPT doesn't know your CAC on Meta in Hindi belt. It doesn't know what Razorpay charges,
              or that 60% of Tier 3 still pays COD. We do.
            </p>
            <div className="mt-6 space-y-2 text-sm">
              {[
                "Indian competitor database — Unicorns + bootstrappers",
                "WhatsApp & vernacular GTM playbooks",
                "Pricing in ₹, not converted USD",
                "Aware of Bharat ka pin-code logistics",
              ].map((t) => (
                <div key={t} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-teal" /> <span>{t}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {items.map(({ icon: Icon, title, desc }) => (
              <Card key={title} className="shadow-soft">
                <CardContent className="p-5">
                  <Icon className="mb-3 h-5 w-5 text-teal" />
                  <h3 className="font-semibold">{title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CalculatorPreview() {
  return (
    <section className="container mx-auto px-4 py-24">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h2 className="text-3xl font-bold md:text-4xl">Try the Unit Economics calculator</h2>
        <p className="mt-4 text-muted-foreground">
          See if your idea works before you write a single line of code.
        </p>
      </div>
      <div className="mx-auto max-w-2xl">
        <UnitEconomics />
      </div>
    </section>
  );
}

function Pricing() {
  const navigate = useNavigate();
  const tiers = [
    {
      name: "Free",
      price: "₹0",
      period: "forever",
      desc: "For exploring your first idea.",
      features: ["1 idea report / month", "Basic competitor table", "LTV/CAC calculator", "Swadeshi stack list"],
      cta: "Start free",
      highlight: false,
    },
    {
      name: "Pro",
      price: "₹999",
      period: "/ month",
      desc: "For founders building seriously.",
      features: ["Unlimited reports", "Deep competitor intel", "PDF investor exports", "Tier 1/2/3 segmentation", "Priority email support"],
      cta: "Go Pro",
      highlight: true,
    },
    {
      name: "Premium",
      price: "₹2,499",
      period: "one-time",
      desc: "Lifetime access. No subscriptions.",
      features: ["Everything in Pro", "Lifetime access", "Founder community access", "1:1 onboarding call"],
      cta: "Buy lifetime",
      highlight: false,
    },
  ];

  return (
    <section id="pricing" className="container mx-auto px-4 py-24">
      <div className="mx-auto mb-14 max-w-2xl text-center">
        <h2 className="text-3xl font-bold md:text-4xl">Pricing built for Indian founders</h2>
        <p className="mt-4 text-muted-foreground">Start free. Upgrade when you raise.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-3 md:items-stretch">
        {tiers.map((t) => (
          <Card
            key={t.name}
            className={`group relative overflow-hidden border-border/60 bg-card/80 shadow-soft backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-glow ${
              t.highlight
                ? "border-teal/60 shadow-glow md:scale-[1.03] md:hover:scale-[1.05]"
                : "hover:border-teal/40"
            }`}
          >
            {t.highlight && (
              <>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-saffron/10 via-transparent to-teal/10" />
                <div className="pointer-events-none absolute -inset-x-10 -top-20 h-40 bg-gradient-primary opacity-25 blur-3xl" />
              </>
            )}
            {!t.highlight && (
              <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-primary opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-20" />
            )}
            <div
              className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent ${
                t.highlight ? "via-saffron/80" : "via-teal/40"
              }`}
            />
            {t.highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-primary px-3 py-1 text-xs font-medium text-primary-foreground shadow-glow ring-1 ring-white/20">
                Most popular
              </div>
            )}
            <CardContent className="relative p-7">
              <div className="flex items-center gap-2">
                <div className={`text-sm font-semibold uppercase tracking-wider ${t.highlight ? "text-teal" : "text-muted-foreground"}`}>
                  {t.name}
                </div>
                {t.highlight && <Sparkles className="h-3.5 w-3.5 text-saffron" />}
              </div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className={`text-5xl font-bold tracking-tight ${t.highlight ? "text-gradient" : ""}`}>{t.price}</span>
                <span className="text-sm text-muted-foreground">{t.period}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{t.desc}</p>
              <Button
                className={`mt-6 w-full ${t.highlight ? "bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90" : ""}`}
                variant={t.highlight ? "default" : "outline"}
                onClick={() => navigate({ to: "/auth" })}
              >
                {t.cta} <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
              <div className="my-6 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />
              <ul className="space-y-2.5 text-sm">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className={`mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${t.highlight ? "bg-gradient-primary" : "bg-teal/15"}`}>
                      <Check className={`h-3 w-3 ${t.highlight ? "text-primary-foreground" : "text-teal"}`} />
                    </span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
