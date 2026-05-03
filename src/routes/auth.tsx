import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Rocket, ArrowRight, Loader2, Lock, ShieldCheck, EyeOff, CheckCircle2, AlertCircle,
} from "lucide-react";
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
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — HeadStart" },
      { name: "description", content: "Sign in or create your HeadStart account." },
    ],
  }),
  component: AuthPage,
});

type FieldState = "idle" | "valid" | "error";

function validateEmail(v: string): FieldState {
  if (!v) return "idle";
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "valid" : "error";
}
function passwordStrength(v: string): { state: FieldState; msg: string } {
  if (!v) return { state: "idle", msg: "" };
  if (v.length < 6) return { state: "error", msg: "At least 6 characters required." };
  if (v.length < 8) return { state: "valid", msg: "Okay — try 8+ chars for stronger security." };
  if (!/[A-Z]/.test(v) || !/[0-9]/.test(v))
    return { state: "valid", msg: "Good — add a capital letter or number for extra strength." };
  return { state: "valid", msg: "Strong password." };
}
function validateName(v: string): FieldState {
  if (!v) return "idle";
  return v.trim().length >= 2 ? "valid" : "error";
}

function AuthPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [busy, setBusy] = useState(false);

  // Sign in
  const [siEmail, setSiEmail] = useState("");
  const [siPwd, setSiPwd] = useState("");

  // Sign up
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");

  const nameState = useMemo(() => validateName(name), [name]);
  const emailState = useMemo(() => validateEmail(email), [email]);
  const pwdInfo = useMemo(() => passwordStrength(pwd), [pwd]);
  const siEmailState = useMemo(() => validateEmail(siEmail), [siEmail]);

  useEffect(() => {
    if (!loading && user) navigate({ to: "/dashboard" });
  }, [user, loading, navigate]);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!siEmail || !siPwd) return toast.error("Email and password required");
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email: siEmail, password: siPwd });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome back!");
    navigate({ to: "/dashboard" });
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (nameState !== "valid" || emailState !== "valid" || pwdInfo.state !== "valid") {
      return toast.error("Please fix the highlighted fields");
    }
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email,
      password: pwd,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: { name },
      },
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Account created!");
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
    if (result.redirected) return;
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="relative min-h-screen bg-gradient-hero">
      <Toaster richColors />
      <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-6 flex items-center justify-center gap-2 font-semibold">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground shadow-glow">
              <Rocket className="h-4 w-4" />
            </span>
            <span className="text-xl tracking-tight">HeadStart</span>
          </Link>

          <Card className="glass border-border/60 shadow-soft">
            <CardContent className="p-6 sm:p-7">
              {/* Trust banner */}
              <div className="mb-5 flex items-start gap-3 rounded-xl border border-teal/30 bg-teal/5 p-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal/15 text-teal">
                  <Lock className="h-4 w-4" />
                </span>
                <div className="text-xs leading-relaxed">
                  <div className="font-semibold text-foreground">Your ideas are secure & encrypted.</div>
                  <div className="text-muted-foreground">
                    We never share your startup data. Bank-grade transport security on every request.
                  </div>
                </div>
              </div>

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
                <span className="relative z-10 bg-background px-2">or with email</span>
                <div className="absolute inset-x-0 top-1/2 -z-0 h-px bg-border" />
              </div>

              <Tabs defaultValue="signup">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signup">Create account</TabsTrigger>
                  <TabsTrigger value="signin">Sign in</TabsTrigger>
                </TabsList>

                <TabsContent value="signup" className="mt-6">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <ValidatedField
                      label="Full name"
                      id="name"
                      value={name}
                      onChange={setName}
                      state={nameState}
                      placeholder="Aarav Sharma"
                      errorMsg="Please enter your full name."
                      validMsg="Looks good."
                    />
                    <ValidatedField
                      label="Email"
                      id="email"
                      type="email"
                      value={email}
                      onChange={setEmail}
                      state={emailState}
                      placeholder="you@startup.in"
                      errorMsg="Please enter a valid email address."
                      validMsg="Email looks valid."
                    />
                    <ValidatedField
                      label="Password"
                      id="password"
                      type="password"
                      value={pwd}
                      onChange={setPwd}
                      state={pwdInfo.state}
                      placeholder="••••••••"
                      errorMsg={pwdInfo.msg}
                      validMsg={pwdInfo.msg}
                    />
                    <Button
                      type="submit"
                      disabled={busy}
                      className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90"
                    >
                      {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Create account <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signin" className="mt-6">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <ValidatedField
                      label="Email"
                      id="si-email"
                      type="email"
                      value={siEmail}
                      onChange={setSiEmail}
                      state={siEmailState}
                      placeholder="you@startup.in"
                      errorMsg="Please enter a valid email."
                      validMsg=""
                    />
                    <div className="space-y-1.5">
                      <Label htmlFor="si-password">Password</Label>
                      <Input
                        id="si-password"
                        type="password"
                        value={siPwd}
                        onChange={(e) => setSiPwd(e.target.value)}
                        placeholder="••••••••"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={busy}
                      className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90"
                    >
                      {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Sign in
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              {/* Trust badges row */}
              <div className="mt-6 grid grid-cols-3 gap-2 border-t border-border/60 pt-5 text-[11px] text-muted-foreground">
                <TrustChip icon={ShieldCheck} label="Encrypted" />
                <TrustChip icon={EyeOff} label="Private by default" />
                <TrustChip icon={Lock} label="No data sharing" />
              </div>
            </CardContent>
          </Card>
          <p className="mt-6 text-center text-xs text-muted-foreground">
            By continuing you agree to our Terms & Privacy. We do not share your startup data.
          </p>
        </div>
      </div>
    </div>
  );
}

function ValidatedField({
  label, id, value, onChange, state, placeholder, errorMsg, validMsg, type = "text",
}: {
  label: string; id: string; value: string; onChange: (v: string) => void;
  state: FieldState; placeholder?: string; errorMsg?: string; validMsg?: string; type?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "pr-9",
            state === "valid" && "border-teal/60 focus-visible:ring-teal/40",
            state === "error" && "border-destructive/70 focus-visible:ring-destructive/40",
          )}
        />
        {state === "valid" && (
          <CheckCircle2 className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-teal" />
        )}
        {state === "error" && (
          <AlertCircle className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-destructive" />
        )}
      </div>
      {state === "error" && errorMsg && (
        <p className="text-[11px] text-destructive">{errorMsg}</p>
      )}
      {state === "valid" && validMsg && (
        <p className="text-[11px] text-teal">{validMsg}</p>
      )}
    </div>
  );
}

function TrustChip({ icon: Icon, label }: { icon: typeof Lock; label: string }) {
  return (
    <div className="flex items-center justify-center gap-1.5 rounded-md border border-border/60 bg-card/50 px-2 py-1.5">
      <Icon className="h-3 w-3 text-teal" />
      <span>{label}</span>
    </div>
  );
}
