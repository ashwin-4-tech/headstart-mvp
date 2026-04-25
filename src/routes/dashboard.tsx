import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Sparkles, LogOut, Wand2, Download } from "lucide-react";
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
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Generation failed. Try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const slug = idea.trim().slice(0, 40).replace(/[^a-z0-9]+/gi, "-").toLowerCase() || "report";
    a.download = `headstart-${slug}-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Report downloaded");
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
                rows={5}
                placeholder="e.g. A WhatsApp-first grocery delivery app for Tier 2 cities with COD support and regional language UI…"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-[1fr_1fr_auto]">
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
              <div className="flex items-end">
                <Button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90 sm:w-auto"
                  size="lg"
                >
                  {loading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating…</>
                  ) : (
                    <><Sparkles className="mr-2 h-4 w-4" /> Generate Report</>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mt-8">
          {loading && <LoadingSkeleton />}
          {report && (
            <>
              <div className="mb-3 flex justify-end">
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="mr-1.5 h-4 w-4" /> Download report
                </Button>
              </div>
              <ResultsDashboard report={report} />
            </>
          )}
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
          Fill in your idea above and hit "Generate Report". You'll get a 6-tab dashboard:
          Market, Competitors, Product, Brand, Data, and Content.
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
          {["Scanning competitors", "Modeling unit economics", "Drafting brand & content"].map((t, i) => (
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

