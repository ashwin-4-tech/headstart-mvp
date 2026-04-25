import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { TrendingUp, TrendingDown } from "lucide-react";

export function UnitEconomics() {
  const [cac, setCac] = useState(450);
  const [arpu, setArpu] = useState(199);
  const [months, setMonths] = useState(8);

  const { ltv, ratio, healthy } = useMemo(() => {
    const ltv = arpu * months;
    const ratio = ltv / Math.max(cac, 1);
    return { ltv, ratio, healthy: ratio >= 3 };
  }, [cac, arpu, months]);

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-gradient">Unit Economics</span>
          <span className="text-xs font-normal text-muted-foreground">
            (Indian benchmarks)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Field label="Customer Acquisition Cost (CAC)" value={`₹${cac}`}>
          <Slider value={[cac]} min={50} max={3000} step={10} onValueChange={([v]) => setCac(v)} />
        </Field>
        <Field label="Avg Revenue / User / month (ARPU)" value={`₹${arpu}`}>
          <Slider value={[arpu]} min={49} max={2000} step={10} onValueChange={([v]) => setArpu(v)} />
        </Field>
        <Field label="Avg Customer Lifetime (months)" value={`${months}`}>
          <Slider value={[months]} min={1} max={36} step={1} onValueChange={([v]) => setMonths(v)} />
        </Field>

        <div className="grid grid-cols-3 gap-3 rounded-xl border bg-muted/40 p-4">
          <Stat label="LTV" value={`₹${ltv.toLocaleString("en-IN")}`} />
          <Stat label="CAC" value={`₹${cac.toLocaleString("en-IN")}`} />
          <Stat
            label="LTV : CAC"
            value={`${ratio.toFixed(2)}x`}
            tone={healthy ? "good" : "bad"}
          />
        </div>

        <div className={`flex items-start gap-2 rounded-lg p-3 text-sm ${healthy ? "bg-teal/10 text-foreground" : "bg-destructive/10 text-foreground"}`}>
          {healthy ? <TrendingUp className="mt-0.5 h-4 w-4 text-teal" /> : <TrendingDown className="mt-0.5 h-4 w-4 text-destructive" />}
          <span>
            {healthy
              ? "Healthy ratio — investors look for ≥ 3x. Your model is viable for the Indian market."
              : "Below 3x — typical for early Indian D2C. Reduce CAC via WhatsApp/UPI flows or boost retention."}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function Field({ label, value, children }: { label: string; value: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <Label className="text-sm">{label}</Label>
        <span className="text-sm font-semibold">{value}</span>
      </div>
      {children}
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: "good" | "bad" }) {
  return (
    <div className="text-center">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className={`mt-1 text-lg font-semibold ${tone === "good" ? "text-teal" : tone === "bad" ? "text-destructive" : ""}`}>
        {value}
      </div>
    </div>
  );
}
