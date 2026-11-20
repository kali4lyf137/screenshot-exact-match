import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ChefHat, QrCode, ReceiptText, ScanLine, Sparkles } from "lucide-react";
import { useState } from "react";
import heroImage from "@/assets/hero-table.jpg";
import { QrScanDialog } from "@/components/customer/QrScanDialog";
import { MeyoLogo } from "@/components/shared/MeyoLogo";
import { PreviewTag } from "@/components/shared/PreviewNotice";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Meyo — Scan your table, order beautifully" },
      {
        name: "description",
        content: "Scan the QR code at your table to browse the menu, order and follow your food from kitchen to table.",
      },
      { property: "og:title", content: "Meyo — Scan your table, order beautifully" },
      {
        property: "og:description",
        content: "Scan the QR code at your table to browse the menu, order and follow your food from kitchen to table.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Welcome,
});

const STEPS = [
  { icon: QrCode, title: "Scan", body: "Every table has its own code. One scan opens the restaurant's menu." },
  { icon: ChefHat, title: "Order", body: "Browse dishes with photos and send your order to the kitchen." },
  { icon: ReceiptText, title: "Follow", body: "Watch your order move from kitchen to table, and ask for the bill." },
];

function Welcome() {
  const [scanOpen, setScanOpen] = useState(false);

  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <header className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
        <MeyoLogo size="md" />
        <div className="flex items-center gap-3">
          <PreviewTag className="hidden sm:inline-flex" label="Design preview" />
          <Link
            to="/staff"
            className="text-sm font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            For restaurants
          </Link>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-7xl gap-10 px-5 pb-16 pt-2 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-16 lg:pb-24 lg:pt-6">
          <div className="order-2 lg:order-1">
            <p className="eyebrow text-gold animate-rise">Table-side ordering</p>
            <h1 className="mt-4 font-display text-[3.4rem] leading-[0.95] sm:text-7xl lg:text-[5.6rem] animate-rise [animation-delay:80ms]">
              The menu,
              <br />
              <em className="text-teal">at your table.</em>
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground animate-rise [animation-delay:160ms]">
              Scan the code on your table to explore the menu, order when you're ready and follow your
              food from the kitchen — no app to download.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row animate-rise [animation-delay:240ms]">
              <Button size="xl" onClick={() => setScanOpen(true)} className="sm:min-w-56">
                <ScanLine className="size-5" />
                Scan table QR
              </Button>
              <Button size="xl" variant="outline" asChild>
                <Link to="/dine">
                  Explore a sample restaurant
                  <ArrowRight />
                </Link>
              </Button>
            </div>
            <p className="mt-5 flex items-center gap-2 text-xs text-muted-foreground animate-rise [animation-delay:320ms]">
              <Sparkles className="size-3.5 text-gold" /> Sample restaurant uses fictional preview data.
            </p>
          </div>

          <div className="relative order-1 lg:order-2 animate-fade">
            <div className="relative overflow-hidden rounded-2xl shadow-lift">
              <img
                src={heroImage}
                alt="A candlelit table of shared Mediterranean dishes"
                className="aspect-[4/3] w-full object-cover sm:aspect-[16/11] lg:aspect-[4/5]"
              />
              <div className="absolute inset-0 image-scrim opacity-60" aria-hidden />
            </div>

            <div className="absolute -bottom-6 left-4 right-4 flex items-center gap-4 rounded-xl border bg-card/95 p-4 shadow-float backdrop-blur sm:left-auto sm:right-8 sm:w-80 lg:-left-10 lg:right-auto animate-rise [animation-delay:400ms]">
              <div className="grid size-14 shrink-0 place-items-center rounded-lg bg-foreground text-background">
                <QrCode className="size-7 stroke-[1.4]" />
              </div>
              <div className="min-w-0 leading-tight">
                <p className="eyebrow text-[10px] text-muted-foreground">Olea · Terrace</p>
                <p className="mt-1 font-display text-2xl">Table 12</p>
                <p className="text-xs text-muted-foreground">Scan to open the menu</p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t bg-card">
          <ol className="mx-auto grid max-w-7xl gap-px px-5 sm:px-8 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <li key={step.title} className="flex gap-5 py-10 md:px-6 md:first:pl-0">
                <span className="font-display text-5xl leading-none text-gold/70">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <step.icon className="size-4 text-teal" />
                    <h2 className="font-semibold">{step.title}</h2>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <footer className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 px-5 py-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:px-8">
          <MeyoLogo size="sm" className="text-foreground" />
          <p>Design prototype. Not connected to live restaurants, payments or orders.</p>
        </footer>
      </main>

      <QrScanDialog open={scanOpen} onOpenChange={setScanOpen} />
    </div>
  );
}
