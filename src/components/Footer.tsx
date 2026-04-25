import { Rocket } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/60 py-10">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 text-sm text-muted-foreground md:flex-row">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-primary text-primary-foreground">
            <Rocket className="h-3.5 w-3.5" />
          </span>
          <span className="font-medium text-foreground">HeadStart</span>
          <span>· MVP for Powerhouse</span>
        </div>
        <p>Made in India 🇮🇳 for Indian founders.</p>
      </div>
    </footer>
  );
}
