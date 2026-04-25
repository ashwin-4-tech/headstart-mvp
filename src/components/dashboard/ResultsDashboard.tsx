import { useState } from "react";
import { toast } from "sonner";
import {
  TrendingUp,
  Swords,
  Layers,
  Palette,
  BarChart3,
  Megaphone,
  ExternalLink,
  Copy,
  Sparkles,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { UnitEconomics } from "@/components/UnitEconomics";
import type { GeneratedOutputs } from "@/utils/api";

type TabKey = "market" | "competitors" | "product" | "brand" | "data" | "content";

const TABS: { key: TabKey; label: string; icon: LucideIcon; hint: string }[] = [
  { key: "market", label: "Market", icon: TrendingUp, hint: "TAM · SAM · SOM" },
  { key: "competitors", label: "Competitors", icon: Swords, hint: "Benchmark" },
  { key: "product", label: "Product", icon: Layers, hint: "MVP & flow" },
  { key: "brand", label: "Brand", icon: Palette, hint: "Names & kit" },
  { key: "data", label: "Data", icon: BarChart3, hint: "Unit economics" },
  { key: "content", label: "Content", icon: Megaphone, hint: "Copy & posts" },
];

export function ResultsDashboard({ report }: { report: GeneratedOutputs }) {
  const [active, setActive] = useState<TabKey>("market");

  return (
    <Card className="overflow-hidden shadow-soft">
      <div className="grid md:grid-cols-[220px_1fr]">
        {/* Sidebar */}
        <aside className="border-b bg-muted/40 p-3 md:border-b-0 md:border-r">
          <div className="mb-2 px-2 pt-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Report
          </div>
          <nav className="flex gap-1 overflow-x-auto md:flex-col md:overflow-visible">
            {TABS.map((t) => {
              const Icon = t.icon;
              const isActive = active === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setActive(t.key)}
                  className={cn(
                    "group flex shrink-0 items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors md:w-full",
                    isActive
                      ? "bg-gradient-primary text-primary-foreground shadow-soft"
                      : "hover:bg-muted",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <div className="hidden md:block">
                    <div className="font-medium leading-tight">{t.label}</div>
                    <div className={cn("text-[11px] leading-tight", isActive ? "text-primary-foreground/80" : "text-muted-foreground")}>
                      {t.hint}
                    </div>
                  </div>
                  <span className="md:hidden">{t.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content */}
        <div className="p-5 md:p-7">
          {active === "market" && <MarketTab report={report} />}
          {active === "competitors" && <CompetitorsTab report={report} />}
          {active === "product" && <ProductTab report={report} />}
          {active === "brand" && <BrandTab report={report} />}
          {active === "data" && <DataTab report={report} />}
          {active === "content" && <ContentTab report={report} />}
        </div>
      </div>
    </Card>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-5">
      <h2 className="text-xl font-bold tracking-tight">{title}</h2>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
}

function MarketTab({ report }: { report: GeneratedOutputs }) {
  return (
    <div>
      <SectionHeader title="Market opportunity" subtitle="Sized for the Indian market in ₹ Crore." />
      <div className="grid gap-4 md:grid-cols-3">
        <MarketStat
          abbr="TAM"
          label="Total Addressable Market"
          meaning="The entire revenue opportunity if every potential customer in India bought your product. The ceiling — useful for vision, not for planning."
          value={report.market_data.tam}
          tone="saffron"
        />
        <MarketStat
          abbr="SAM"
          label="Serviceable Addressable Market"
          meaning="The slice of TAM you can realistically reach with your business model, language, geography and channels (e.g. Tier 1+2 cities, Hindi+English)."
          value={report.market_data.sam}
          tone="teal"
        />
        <MarketStat
          abbr="SOM"
          label="Serviceable Obtainable Market"
          meaning="The share of SAM you can actually win in Year 1 — given your team, budget and competition. This is your real revenue target."
          value={report.market_data.som}
          tone="navy"
        />
      </div>
      <Card className="mt-6 border-dashed bg-muted/30">
        <CardContent className="p-5 text-sm text-muted-foreground">
          <strong className="text-foreground">Insight:</strong> Your SOM is a realistic Year-1 capture
          based on city-tier reach, language coverage, and historical Indian D2C conversion benchmarks.
          Aim to capture 15–20% of SAM by Year 3.
        </CardContent>
      </Card>
    </div>
  );
}

function CompetitorsTab({ report }: { report: GeneratedOutputs }) {
  return (
    <div>
      <SectionHeader title="India-specific competitors" subtitle="Unicorns to bootstrapped — know your battlefield." />
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Funding</TableHead>
              <TableHead>Monthly users</TableHead>
              <TableHead>Pricing</TableHead>
              <TableHead>Their weakness</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {report.competitors.map((c) => (
              <TableRow key={c.name}>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={c.type === "Unicorn" ? "border-saffron/50 bg-saffron/10" : "border-teal/50 bg-teal/10"}
                  >
                    {c.type}
                  </Badge>
                </TableCell>
                <TableCell>{c.funding}</TableCell>
                <TableCell>{c.monthly_users}</TableCell>
                <TableCell>{c.pricing}</TableCell>
                <TableCell className="text-muted-foreground">{c.weakness}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function ProductTab({ report }: { report: GeneratedOutputs }) {
  const toneFor = (p: "Must" | "Should" | "Later") =>
    p === "Must" ? "border-saffron/50 bg-saffron/10" : p === "Should" ? "border-teal/50 bg-teal/10" : "border-border bg-muted";

  return (
    <div>
      <SectionHeader title="Product blueprint" subtitle="MVP scope, user flow, and the Swadeshi stack to ship it." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">MVP features</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {report.product.mvp_features.map((f) => (
              <div key={f.name} className="flex items-center justify-between rounded-lg border bg-muted/30 p-3">
                <div className="text-sm font-medium">{f.name}</div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={toneFor(f.priority)}>{f.priority}</Badge>
                  <span className="text-xs text-muted-foreground">{f.effort}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">User flow</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              {report.product.user_flow.map((step, i) => {
                const isLast = i === report.product.user_flow.length - 1;
                const tones = [
                  "from-saffron/20 to-saffron/5 border-saffron/40",
                  "from-teal/20 to-teal/5 border-teal/40",
                  "from-primary/20 to-primary/5 border-primary/40",
                ];
                const tone = tones[i % tones.length];
                return (
                  <div key={step} className="flex flex-col items-stretch">
                    <div className={cn(
                      "relative flex items-center gap-3 rounded-xl border bg-gradient-to-br p-3 shadow-sm transition-transform hover:-translate-y-0.5",
                      tone,
                    )}>
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-primary text-xs font-bold text-primary-foreground shadow-soft">
                        {i + 1}
                      </span>
                      <span className="text-sm font-medium leading-snug">{step}</span>
                    </div>
                    {!isLast && (
                      <div className="flex justify-center py-1" aria-hidden>
                        <ArrowRight className="h-4 w-4 rotate-90 text-muted-foreground/60" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <h3 className="mt-8 mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Recommended Swadeshi stack
      </h3>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {report.swadeshi_stack.map((s) => (
          <a
            key={s.name}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block rounded-xl border bg-muted/30 p-4 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:bg-muted/60 hover:shadow-soft"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 font-semibold">
                  <span className="truncate">{s.name}</span>
                  <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                </div>
                <div className="text-xs text-muted-foreground">{s.category}</div>
              </div>
              <Badge variant="outline" className="shrink-0 border-teal/50 bg-teal/10 text-xs">{s.price}</Badge>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{s.why}</p>
            <div className="mt-3 truncate text-[11px] text-muted-foreground/70">
              {s.url.replace(/^https?:\/\//, "")}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

function BrandTab({ report }: { report: GeneratedOutputs }) {
  return (
    <div>
      <SectionHeader title="Brand kit" subtitle="Names, taglines, palette and tone — ready to brief a designer." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Name suggestions</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {report.brand.names.map((n) => (
              <div key={n.name} className="rounded-lg border bg-muted/30 p-3">
                <div className="font-semibold text-gradient">{n.name}</div>
                <div className="mt-1 text-sm text-muted-foreground">{n.rationale}</div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Taglines & tone</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {report.brand.taglines.map((t) => (
              <div key={t} className="rounded-lg border bg-muted/30 p-3 text-sm italic">
                "{t}"
              </div>
            ))}
            <div className="rounded-lg border border-dashed p-3 text-sm">
              <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Voice</div>
              {report.brand.tone}
            </div>
          </CardContent>
        </Card>
      </div>

      <h3 className="mt-8 mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Color palette
      </h3>
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
        {report.brand.palette.map((c) => (
          <div key={c.hex} className="overflow-hidden rounded-xl border">
            <div className="h-20" style={{ backgroundColor: c.hex }} />
            <div className="p-3">
              <div className="text-sm font-semibold">{c.name}</div>
              <div className="text-xs text-muted-foreground">{c.hex}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DataTab({ report }: { report: GeneratedOutputs }) {
  return (
    <div>
      <SectionHeader title="Data & unit economics" subtitle="The numbers that decide whether this works." />
      <div className="grid gap-4 md:grid-cols-4">
        {report.data.kpis.map((k) => (
          <div key={k.label} className="rounded-xl border bg-muted/40 p-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">{k.label}</div>
            <div className="mt-1 text-xl font-bold">{k.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Conversion funnel</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {report.data.funnel.map((f, i) => {
              const widths = [100, 70, 45, 28];
              return (
                <div key={f.stage}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span>{f.stage}</span>
                    <span className="font-semibold text-teal">{f.rate}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full bg-gradient-primary" style={{ width: `${widths[i] ?? 20}%` }} />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
        <UnitEconomics />
      </div>
    </div>
  );
}

function ContentTab({ report }: { report: GeneratedOutputs }) {
  return (
    <div>
      <SectionHeader title="Launch content pack" subtitle="Copy you can paste into your landing page, socials and outreach." />
      <Card className="mb-6">
        <CardHeader><CardTitle className="text-base">Landing page hero</CardTitle></CardHeader>
        <CardContent>
          <div className="rounded-xl border bg-gradient-hero p-6">
            <h3 className="text-2xl font-bold tracking-tight">{report.content.landing_headline}</h3>
            <p className="mt-2 text-muted-foreground">{report.content.landing_sub}</p>
          </div>
        </CardContent>
      </Card>

      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Social posts
      </h3>
      <div className="grid gap-3 md:grid-cols-2">
        {report.content.social_posts.map((p) => (
          <div key={p.platform} className="rounded-xl border bg-muted/30 p-4">
            <Badge variant="outline" className="mb-2 border-teal/50 bg-teal/10 text-xs">{p.platform}</Badge>
            <p className="text-sm">{p.copy}</p>
          </div>
        ))}
      </div>

      <h3 className="mt-8 mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Cold email template
      </h3>
      <Card>
        <CardContent className="space-y-2 p-5 text-sm">
          <div><span className="font-semibold">Subject:</span> {report.content.cold_email.subject}</div>
          <pre className="whitespace-pre-wrap rounded-lg border bg-muted/40 p-3 font-sans">{report.content.cold_email.body}</pre>
        </CardContent>
      </Card>
    </div>
  );
}

function MarketStat({
  abbr,
  label,
  meaning,
  value,
  tone,
}: {
  abbr: string;
  label: string;
  meaning: string;
  value: number;
  tone: "saffron" | "teal" | "navy";
}) {
  const toneCls = tone === "saffron" ? "text-saffron" : tone === "teal" ? "text-teal" : "text-foreground";
  const dotCls = tone === "saffron" ? "bg-saffron" : tone === "teal" ? "bg-teal" : "bg-foreground";
  return (
    <div className="flex h-full flex-col rounded-xl border bg-muted/40 p-5">
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${dotCls}`} />
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {abbr} · {label}
        </span>
      </div>
      <div className={`mt-3 text-3xl font-bold ${toneCls}`}>
        ₹{value.toLocaleString("en-IN")} Cr
      </div>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{meaning}</p>
    </div>
  );
}
