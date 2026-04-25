import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Rocket, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { auth } from "@/utils/api";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — HeadStart" },
      { name: "description", content: "Sign in or create your HeadStart account." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();

  const handleSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "").trim();
    if (!email) return toast.error("Email required");
    auth.signIn(email);
    toast.success("Welcome back!");
    navigate({ to: "/dashboard" });
  };

  const handleSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const password = String(fd.get("password") || "");
    if (!name || !email || password.length < 6) {
      return toast.error("Fill all fields (password ≥ 6 chars)");
    }
    auth.signUp({
      name,
      email,
      industry_focus: String(fd.get("industry") || "Tech"),
      preferred_language: String(fd.get("language") || "English"),
      budget_range: String(fd.get("budget") || "₹0 – ₹50K"),
    });
    toast.success("Account created!");
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="relative min-h-screen bg-gradient-hero">
      <Toaster richColors />
      <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-8 flex items-center justify-center gap-2 font-semibold">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground shadow-glow">
              <Rocket className="h-4 w-4" />
            </span>
            <span className="text-xl tracking-tight">HeadStart</span>
          </Link>
          <Card className="glass shadow-soft">
            <CardContent className="p-6">
              <Tabs defaultValue="signup">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signup">Create account</TabsTrigger>
                  <TabsTrigger value="signin">Sign in</TabsTrigger>
                </TabsList>

                <TabsContent value="signup" className="mt-6">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <Field label="Full name" name="name" placeholder="Aarav Sharma" />
                    <Field label="Email" name="email" type="email" placeholder="you@startup.in" />
                    <Field label="Password" name="password" type="password" placeholder="••••••••" />

                    <SelectField name="industry" label="Industry focus" options={[
                      "D2C / E-commerce", "FinTech", "EdTech", "AgriTech", "HealthTech", "SaaS / Tech", "AI", "Logistics",
                    ]} />
                    <SelectField name="language" label="Preferred language" options={[
                      "English", "Hindi", "Hinglish", "Tamil", "Telugu", "Marathi", "Bengali", "Kannada",
                    ]} />
                    <SelectField name="budget" label="Budget range" options={[
                      "₹0 – ₹50K", "₹50K – ₹2L", "₹2L – ₹10L", "₹10L – ₹50L", "₹50L+",
                    ]} />

                    <Button type="submit" className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90">
                      Create account <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signin" className="mt-6">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <Field label="Email" name="email" type="email" placeholder="you@startup.in" />
                    <Field label="Password" name="password" type="password" placeholder="••••••••" />
                    <Button type="submit" className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90">
                      Sign in
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          <p className="mt-6 text-center text-xs text-muted-foreground">
            By continuing you agree to our Terms & Privacy.
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, name, type = "text", placeholder }: { label: string; name: string; type?: string; placeholder?: string }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} type={type} placeholder={placeholder} />
    </div>
  );
}

function SelectField({ name, label, options }: { name: string; label: string; options: string[] }) {
  const [val, setVal] = useState(options[0]);
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <input type="hidden" name={name} value={val} />
      <Select value={val} onValueChange={setVal}>
        <SelectTrigger><SelectValue /></SelectTrigger>
        <SelectContent>
          {options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
}
