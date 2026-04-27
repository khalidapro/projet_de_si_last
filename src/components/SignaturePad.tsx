import { motion, AnimatePresence } from "framer-motion";
import { PenLine, Check, RotateCcw } from "lucide-react";
import { useRef, useState, useEffect } from "react";

/**
 * Mock e-signature pad: lawyer draws with mouse/touch.
 * On "Confirmer Signature" the strokes animate as flowing ink onto the document preview.
 */
export function SignaturePad({
  documentName,
  onSigned,
}: {
  documentName: string;
  onSigned?: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const [hasInk, setHasInk] = useState(false);
  const [signing, setSigning] = useState(false);
  const [signed, setSigned] = useState(false);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d")!;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#6F4E37";
    ctx.lineWidth = 2.4;
  }, []);

  const pos = (e: React.MouseEvent | React.TouchEvent) => {
    const c = canvasRef.current!;
    const r = c.getBoundingClientRect();
    const t = "touches" in e ? e.touches[0] : (e as React.MouseEvent);
    return { x: t.clientX - r.left, y: t.clientY - r.top };
  };

  const start = (e: React.MouseEvent | React.TouchEvent) => {
    drawing.current = true;
    last.current = pos(e);
  };
  const move = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawing.current) return;
    const ctx = canvasRef.current!.getContext("2d")!;
    const p = pos(e);
    ctx.beginPath();
    ctx.moveTo(last.current!.x, last.current!.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    last.current = p;
    if (!hasInk) setHasInk(true);
  };
  const end = () => {
    drawing.current = false;
    last.current = null;
  };

  const clear = () => {
    const c = canvasRef.current!;
    c.getContext("2d")!.clearRect(0, 0, c.width, c.height);
    setHasInk(false);
    setSigned(false);
  };

  const confirm = () => {
    if (!hasInk || signing) return;
    setSigning(true);
    setTimeout(() => {
      setSigning(false);
      setSigned(true);
      onSigned?.();
    }, 1600);
  };

  return (
    <div className="surface rounded-2xl p-5">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg chip-emerald">
            <PenLine className="h-4 w-4" />
          </div>
          <div>
            <div className="text-sm font-semibold">Documents à signer</div>
            <div className="text-[11px] text-muted-foreground truncate max-w-[220px]">{documentName}</div>
          </div>
        </div>
        <button
          onClick={clear}
          className="grid h-8 w-8 place-items-center rounded-lg surface hover:bg-secondary text-muted-foreground"
          aria-label="Clear signature"
          title="Clear"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="relative rounded-xl bg-[oklch(0.96_0.01_80)] dark:bg-[oklch(0.18_0.01_60)] ring-1 ring-border p-4 overflow-hidden">
        <div className="space-y-1.5 mb-4">
          <div className="h-2 w-3/4 rounded bg-foreground/10" />
          <div className="h-2 w-2/3 rounded bg-foreground/10" />
          <div className="h-2 w-4/5 rounded bg-foreground/10" />
        </div>
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Signature de l'avocat</div>
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={420}
            height={110}
            onMouseDown={start}
            onMouseMove={move}
            onMouseUp={end}
            onMouseLeave={end}
            onTouchStart={start}
            onTouchMove={move}
            onTouchEnd={end}
            className="block w-full h-[110px] rounded-lg bg-background/60 border border-dashed border-primary/40 cursor-crosshair touch-none"
          />
          <AnimatePresence>
            {signing && (
              <motion.svg
                key="ink"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                viewBox="0 0 420 110"
                className="pointer-events-none absolute inset-0 w-full h-[110px]"
              >
                <motion.path
                  d="M 30 75 C 70 30, 110 95, 150 60 S 230 25, 270 70 S 360 35, 400 65"
                  fill="none"
                  stroke="#6F4E37"
                  strokeWidth={2.6}
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.4, ease: "easeInOut" }}
                />
              </motion.svg>
            )}
          </AnimatePresence>
        </div>
        <div className="mt-3 text-[10px] text-muted-foreground">
          Signez ci-dessus avec la souris ou le doigt.
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2">
        <div className="text-[11px] text-muted-foreground inline-flex items-center gap-1.5">
          {signed ? (
            <>
              <Check className="h-3.5 w-3.5 text-primary" />
              Signed · sealed with timestamp
            </>
          ) : (
            "Mock e-signature · not legally binding"
          )}
        </div>
        <button
          onClick={confirm}
          disabled={!hasInk || signing || signed}
          data-magnetic
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground glow-primary disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {signing ? (
            <>
              <motion.span
                className="h-3 w-3 rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
              />
              Signature en cours…
            </>
          ) : signed ? (
            <>
              <Check className="h-3.5 w-3.5" /> Signature confirmée
            </>
          ) : (
            <>
              <PenLine className="h-3.5 w-3.5" /> Confirmer Signature
            </>
          )}
        </button>
      </div>
    </div>
  );
}
