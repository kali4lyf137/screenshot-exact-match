import { createFileRoute, Link } from "@tanstack/react-router";
import { MeyoLogo } from "@/components/shared/MeyoLogo";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/staff")({
  head: () => ({
    meta: [
      { title: "Meyo for restaurants — Staff app" },
      { name: "description", content: "Meyo's staff app for orders, kitchen and menu management." },
      { property: "og:title", content: "Meyo for restaurants — Staff app" },
      { property: "og:description", content: "Meyo's staff app for orders, kitchen and menu management." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StaffPlaceholder,
});

function StaffPlaceholder() {
  return (
    <div className="grid min-h-screen place-items-center bg-background px-5 text-center">
      <div>
        <MeyoLogo size="lg" />
        <h1 className="mt-6 font-display text-5xl">Staff app coming next</h1>
        <p className="mt-3 text-muted-foreground">The dashboard, orders, kitchen and menu screens are not built yet.</p>
        <Button className="mt-6" asChild>
          <Link to="/">Back to Meyo</Link>
        </Button>
      </div>
    </div>
  );
}
