import { BellRing, Check, Loader2, Receipt } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { isNotConnected, meyo } from "@/integrations/meyo";
import { cn } from "@/lib/utils";

type Kind = "waiter" | "bill";
type Phase = "confirm" | "sending" | "preview" | "sent" | "error";

const COPY: Record<Kind, { title: string; body: string; cta: string; done: string }> = {
  waiter: {
    title: "Call a waiter?",
    body: "We'll let your server know you'd like a hand at your table.",
    cta: "Call waiter",
    done: "Your server has been notified.",
  },
  bill: {
    title: "Request the bill?",
    body: "Your server will bring the bill to your table.",
    cta: "Request bill",
    done: "Your bill is on its way.",
  },
};

export function ServiceActions({ sessionId, className }: { sessionId: string; className?: string }) {
  const [open, setOpen] = useState<Kind | null>(null);
  const [phase, setPhase] = useState<Phase>("confirm");

  const start = (kind: Kind) => {
    setPhase("confirm");
    setOpen(kind);
  };

  const send = async () => {
    if (!open) return;
    setPhase("sending");
    try {
      await (open === "waiter" ? meyo.serviceRequests.callWaiter(sessionId) : meyo.serviceRequests.requestBill(sessionId));
      setPhase("sent");
    } catch (error) {
      setPhase(isNotConnected(error) ? "preview" : "error");
    }
  };

  const copy = open ? COPY[open] : null;

  return (
    <>
      <div className={cn("grid grid-cols-2 gap-3", className)}>
        <ActionTile icon={BellRing} label="Call waiter" hint="We'll come over" onClick={() => start("waiter")} />
        <ActionTile icon={Receipt} label="Request bill" hint="Brought to your table" onClick={() => start("bill")} />
      </div>

      <Dialog open={open !== null} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="max-w-sm rounded-xl">
          {copy && (
            <>
              <DialogHeader>
                <div className="mb-2 grid size-12 place-items-center rounded-full bg-gold-soft text-gold">
                  {phase === "preview" || phase === "sent" ? <Check className="size-5" /> : open === "waiter" ? <BellRing className="size-5" /> : <Receipt className="size-5" />}
                </div>
                <DialogTitle className="font-display text-3xl font-normal">
                  {phase === "preview" ? "Preview only" : phase === "sent" ? "Done" : copy.title}
                </DialogTitle>
                <DialogDescription className="leading-relaxed">
                  {phase === "preview"
                    ? "Nothing was sent. In the live Meyo app this notifies the restaurant team straight away."
                    : phase === "sent"
                      ? copy.done
                      : phase === "error"
                        ? "We couldn't reach the restaurant. Please try again or wave to a member of staff."
                        : copy.body}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2 sm:gap-2">
                {phase === "preview" || phase === "sent" ? (
                  <Button size="lg" className="w-full" onClick={() => setOpen(null)}>
                    Close
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" size="lg" onClick={() => setOpen(null)}>
                      Cancel
                    </Button>
                    <Button size="lg" onClick={send} disabled={phase === "sending"}>
                      {phase === "sending" && <Loader2 className="animate-spin" />}
                      {phase === "error" ? "Try again" : copy.cta}
                    </Button>
                  </>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function ActionTile({
  icon: Icon,
  label,
  hint,
  onClick,
}: {
  icon: typeof BellRing;
  label: string;
  hint: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex items-center gap-3 rounded-xl border bg-card p-4 text-left shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift cursor-pointer"
    >
      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-secondary text-teal transition-colors group-hover:bg-teal group-hover:text-teal-foreground">
        <Icon className="size-[18px]" />
      </span>
      <span className="min-w-0 leading-tight">
        <span className="block font-semibold">{label}</span>
        <span className="block truncate text-xs text-muted-foreground">{hint}</span>
      </span>
    </button>
  );
}
