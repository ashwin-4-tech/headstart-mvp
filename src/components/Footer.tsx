import { Rocket, Github, Linkedin } from "lucide-react";

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

        <div className="flex flex-col items-center gap-2 md:flex-row md:gap-4">
          <span>
            Designed by{" "}
            <span className="font-medium text-foreground">Ashwin B</span>
            <span className="ml-1 text-xs">· Product Designer, HeadStart</span>
          </span>
          <div className="flex items-center gap-2">
            <a
              href="https://github.com/ashwin-4-tech"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Ashwin's GitHub profile"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border/60 bg-card/60 text-muted-foreground transition-colors hover:border-teal/40 hover:text-foreground"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/ashwin/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Ashwin's LinkedIn profile"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border/60 bg-card/60 text-muted-foreground transition-colors hover:border-teal/40 hover:text-foreground"
            >
              <Linkedin className="h-4 w-4" />
            </a>
          </div>
        </div>

        <p>Made in India 🇮🇳 for Indian founders.</p>
      </div>
    </footer>
  );
}
