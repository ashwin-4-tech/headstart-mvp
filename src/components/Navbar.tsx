import { Link, useNavigate } from "@tanstack/react-router";
import { Moon, Sun, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { auth } from "@/utils/api";
import { useEffect, useState } from "react";

export function Navbar() {
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const [user, setUser] = useState(auth.getUser());

  useEffect(() => {
    setUser(auth.getUser());
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 glass">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground shadow-glow">
            <Rocket className="h-4 w-4" />
          </span>
          <span className="text-lg tracking-tight">HeadStart</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          <a href="/#pillars" className="hover:text-foreground">Features</a>
          <a href="/#context" className="hover:text-foreground">Why India</a>
          <a href="/#pricing" className="hover:text-foreground">Pricing</a>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          {user ? (
            <Button onClick={() => navigate({ to: "/dashboard" })}>Dashboard</Button>
          ) : (
            <>
              <Button variant="ghost" onClick={() => navigate({ to: "/auth" })}>Sign in</Button>
              <Button onClick={() => navigate({ to: "/auth" })} className="bg-gradient-primary text-primary-foreground hover:opacity-90">
                Get started
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
