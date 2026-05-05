import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/hooks/use-auth";
import "../styles.css";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "HeadStart - MVP for PowerHouse" },
      { property: "og:title", content: "HeadStart - MVP for PowerHouse" },
      { name: "twitter:title", content: "HeadStart - MVP for PowerHouse" },
      { name: "description", content: "Validate your startup idea for the Indian market in 60s. Get market research, competitor analysis, & unit economics tailored for Bharat. Build your powerhouse." },
      { property: "og:description", content: "Validate your startup idea for the Indian market in 60s. Get market research, competitor analysis, & unit economics tailored for Bharat. Build your powerhouse." },
      { name: "twitter:description", content: "Validate your startup idea for the Indian market in 60s. Get market research, competitor analysis, & unit economics tailored for Bharat. Build your powerhouse." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/f334fa31-9eda-41f3-a16a-45d1a7f9ce06" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/f334fa31-9eda-41f3-a16a-45d1a7f9ce06" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold">404</h1>
        <p className="text-muted-foreground">Page not found</p>
      </div>
    </div>
  ),
});

function RootDocument() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <AuthProvider>
          <Outlet />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}
