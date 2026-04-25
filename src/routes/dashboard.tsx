import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Sparkles, LogOut, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Navbar } from "@/components/Navbar";
import { ResultsDashboard } from "@/components/dashboard/ResultsDashboard";
import { auth, generateReport, type GeneratedOutputs, type UserProfile } from "@/utils/api";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — HeadStart" },
      { name: "description", content: "Your India-first startup validation workspace." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [idea, setIdea] = useState("");
  const [tier, setTier] = useState<"Tier 1" | "Tier 2" | "Tier 3">("Tier 1");
  const [audience, setAudience] = useState<"B2B" | "B2C">("B2C");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<GeneratedOutputs | null>(null);

  useEffect(() => {
    const u = auth.getUser();
    if (!u) navigate({ to: "/auth" });
    else setUser(u);
  }, [navigate]);

  const handleGenerate = async () => {
    if (idea.trim().length < 15) {
      toast.error("Describe your idea in at least 15 characters.");
      return;
    }
    setLoading(true);
    setReport(null);
    try {
      const r = await generateReport({
        raw_text_input: idea,
        target_city_tier: tier,
        b2b_or_b2c: audience,
      });
      setReport(r);
      toast.success("Report generated!");
    } catch {
      toast.error("Generation failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    auth.signOut();
    navigate({ to: "/" });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-muted/20">
      <Toaster richColors />
      <Navbar />
      <main className="container mx-auto px-4 py-10">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back, <span className="text-gradient">{user.name}</span>
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Let's validate your next big idea — the Indian way.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="mr-1.5 h-4 w-4" /> Sign out
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          {/* Input */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="h-5 w-5 text-teal" /> Your startup idea
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="idea">Describe your idea</Label>
                <Textarea
                  id="idea"
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  rows={7}
                  placeholder="e.g. A WhatsApp-first grocery delivery app for Tier 2 cities with COD support and regional language UI…"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Target city tier</Label>
                  <Select value={tier} onValueChange={(v) => setTier(v as typeof tier)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tier 1">Tier 1 (Mumbai, Delhi, Bangalore…)</SelectItem>
                      <SelectItem value="Tier 2">Tier 2 (Pune, Jaipur, Lucknow…)</SelectItem>
                      <SelectItem value="Tier 3">Tier 3 (Bharat & smaller towns)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Audience</Label>
                  <Select value={audience} onValueChange={(v) => setAudience(v as typeof audience)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="B2C">B2C — selling to consumers</SelectItem>
                      <SelectItem value="B2B">B2B — selling to businesses</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90"
                size="lg"
              >
                {loading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating your report…</>
                ) : (
                  <><Sparkles className="mr-2 h-4 w-4" /> Generate HeadStart Report</>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Unit Economics */}
          <UnitEconomics />
        </div>

        {/* Results */}
        <div className="mt-8">
          {loading && <LoadingSkeleton />}
          {report && <Results report={report} />}
          {!loading && !report && <EmptyState />}
        </div>
      </main>
    </div>
  );
}

function EmptyState() {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground">
          <Sparkles className="h-5 w-5" />
        </div>
        <h3 className="text-lg font-semibold">Your report will appear here</h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Fill in your idea above and hit “Generate HeadStart Report”. We'll synthesize TAM/SAM/SOM,
          competitors, and your Swadeshi stack.
        </p>
      </CardContent>
    </Card>
  );
}

function LoadingSkeleton() {
  return (
    <Card className="shadow-soft">
      <CardContent className="space-y-4 p-8">
        <div className="flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-teal" />
          <span className="font-medium">Analyzing Indian market data…</span>
        </div>
        <div className="space-y-3">
          {["Scanning competitors", "Modeling unit economics", "Pulling Swadeshi stack"].map((t, i) => (
            <div key={t} className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
                <div
                  className="h-full bg-gradient-primary"
                  style={{ width: `${[70, 45, 25][i]}%`, animation: "pulse 2s ease-in-out infinite" }}
                />
              </div>
              <span className="w-44 shrink-0 text-right">{t}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function Results({ report }: { report: GeneratedOutputs }) {
  return (
    <div className="space-y-6">
      {/* TAM SAM SOM */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Market opportunity (₹ Cr)</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <MarketStat label="TAM" sub="Total Addressable Market" value={report.market_data.tam} tone="saffron" />
          <MarketStat label="SAM" sub="Serviceable Addressable Market" value={report.market_data.sam} tone="teal" />
          <MarketStat label="SOM" sub="Serviceable Obtainable (Yr 1)" value={report.market_data.som} tone="navy" />
        </CardContent>
      </Card>

      {/* Competitors */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>India-specific competitive benchmark</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      {/* Swadeshi stack */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Low-Code Swadeshi Stack</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {report.swadeshi_stack.map((s) => (
            <div key={s.name} className="rounded-xl border bg-muted/30 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold">{s.name}</div>
                  <div className="text-xs text-muted-foreground">{s.category}</div>
                </div>
                <Badge variant="outline" className="shrink-0 border-teal/50 bg-teal/10 text-xs">
                  {s.price}
                </Badge>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{s.why}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function MarketStat({ label, sub, value, tone }: { label: string; sub: string; value: number; tone: "saffron" | "teal" | "navy" }) {
  const toneCls = tone === "saffron" ? "text-saffron" : tone === "teal" ? "text-teal" : "text-foreground";
  return (
    <div className="rounded-xl border bg-muted/40 p-5">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className={`mt-2 text-3xl font-bold ${toneCls}`}>
        ₹{value.toLocaleString("en-IN")} Cr
      </div>
      <div className="mt-1 text-xs text-muted-foreground">{sub}</div>
    </div>
  );
}
