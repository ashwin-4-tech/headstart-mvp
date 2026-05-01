import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Rocket, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/hooks/use-auth";
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
  const { user, loading } = useAuth();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate({ to: "/dashboard" });
  }, [user, loading, navigate]);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "").trim();
    const password = String(fd.get("password") || "");
    if (!email || !password) return toast.error("Email and password required");
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome back!");
    navigate({ to: "/dashboard" });
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const password = String(fd.get("password") || "");
    if (!name || !email || password.length < 6) {
      return toast.error("Fill all fields (password ≥ 6 chars)");
    }
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: { name },
      },
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Account created! Check your email to verify.");
  };

  const handleGoogle = async () => {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: `${window.location.origin}/dashboard`,
    });
    if (result.error) {
      setBusy(false);
      return toast.error(result.error.message ?? "Google sign-in failed");
    }
    if (result.redirected) return; // browser navigates away
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
              <Button
                type="button"
                variant="outline"
                className="mb-4 w-full"
                disabled={busy}
                onClick={handleGoogle}
              >
                {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Continue with Google
              </Button>
              <div className="relative mb-4 text-center text-xs text-muted-foreground">
                <span className="bg-background px-2 relative z-10">or</span>
                <div className="absolute inset-x-0 top-1/2 -z-0 h-px bg-border" />
              </div>
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
                    <Button type="submit" disabled={busy} className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90">
                      {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Create account <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signin" className="mt-6">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <Field label="Email" name="email" type="email" placeholder="you@startup.in" />
                    <Field label="Password" name="password" type="password" placeholder="••••••••" />
                    <Button type="submit" disabled={busy} className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90">
                      {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
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
