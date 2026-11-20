import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { AlertCircle, Camera, Loader2, ScanLine } from "lucide-react";
import { useState } from "react";
import { PreviewNotice } from "@/components/shared/PreviewNotice";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PREVIEW_TABLE_CODE } from "@/data/preview/restaurant";
import { meyo } from "@/integrations/meyo";
import { sessionQuery } from "@/integrations/meyo/queries";

/**
 * QR entry point. Camera scanning belongs to Meyo's existing QR table access (Expo camera);
 * this dialog only shows the interface and resolves codes through `meyo.qr.resolveTableCode`.
 */
export function QrScanDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [code, setCode] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resolve = async (value: string) => {
    setPending(true);
    setError(null);
    try {
      const session = await meyo.qr.resolveTableCode(value);
      queryClient.setQueryData(sessionQuery().queryKey, session);
      onOpenChange(false);
      await navigate({ to: "/dine" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md overflow-hidden rounded-2xl p-0">
        <div className="relative grid aspect-[4/3] place-items-center bg-foreground text-background">
          <div className="relative size-48">
            {["left-0 top-0 border-l-2 border-t-2 rounded-tl-xl", "right-0 top-0 border-r-2 border-t-2 rounded-tr-xl", "left-0 bottom-0 border-l-2 border-b-2 rounded-bl-xl", "right-0 bottom-0 border-r-2 border-b-2 rounded-br-xl"].map((c) => (
              <span key={c} aria-hidden className={`absolute size-10 border-gold ${c}`} />
            ))}
            <span aria-hidden className="absolute inset-x-3 top-2 h-0.5 rounded-full bg-gold/80 shadow-[0_0_18px_2px] shadow-gold/60 animate-scan" />
            <div className="absolute inset-0 grid place-items-center text-background/40">
              <Camera className="size-10 stroke-1" />
            </div>
          </div>
          <p className="absolute bottom-4 text-xs text-background/60">Camera preview appears here in the Meyo app</p>
        </div>

        <div className="space-y-5 p-6 pt-5">
          <DialogHeader>
            <DialogTitle className="font-display text-3xl font-normal">Scan your table</DialogTitle>
            <DialogDescription>
              Point your camera at the QR code on your table, or type the code printed beneath it.
            </DialogDescription>
          </DialogHeader>

          <form
            className="space-y-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (code.trim()) void resolve(code);
            }}
          >
            <Label htmlFor="table-code" className="text-xs font-semibold text-muted-foreground">
              Table code
            </Label>
            <div className="flex gap-2">
              <Input
                id="table-code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. OLEA-T12"
                autoComplete="off"
                className="h-11 font-mono uppercase tracking-wider"
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? "table-code-error" : undefined}
              />
              <Button type="submit" size="lg" disabled={pending || !code.trim()}>
                {pending ? <Loader2 className="animate-spin" /> : <ScanLine />}
                Open
              </Button>
            </div>
            {error && (
              <p id="table-code-error" role="alert" className="flex items-center gap-1.5 text-sm text-destructive">
                <AlertCircle className="size-4" /> {error}
              </p>
            )}
          </form>

          <div className="rounded-lg border border-dashed p-4">
            <PreviewNotice>Try the sample restaurant with code {PREVIEW_TABLE_CODE}.</PreviewNotice>
            <Button variant="soft" className="mt-3 w-full" disabled={pending} onClick={() => void resolve(PREVIEW_TABLE_CODE)}>
              Open preview table
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
