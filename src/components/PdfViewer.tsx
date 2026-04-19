import { AnimatePresence, motion } from "framer-motion";
import { X, FileText, Download } from "lucide-react";

export function PdfViewer({
  open,
  onClose,
  documentName,
  userName,
  layoutId,
}: {
  open: boolean;
  onClose: () => void;
  documentName: string;
  userName: string;
  layoutId: string;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-xl p-4 md:p-10 grid place-items-center"
          onClick={onClose}
        >
          <motion.div
            layoutId={layoutId}
            onClick={(e) => e.stopPropagation()}
            className="glass-strong relative w-full max-w-3xl h-[80vh] rounded-2xl overflow-hidden"
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
              <div className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4 text-primary" />
                <span className="font-medium">{documentName}</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
                  <Download className="h-3.5 w-3.5" /> Download
                </button>
                <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="relative h-[calc(80vh-49px)] overflow-auto bg-[#1a1d2e] p-8">
              {/* Mock document */}
              <div className="mx-auto max-w-2xl bg-[#f5f3ee] text-slate-900 rounded-md p-10 shadow-2xl relative overflow-hidden">
                {/* Watermark */}
                <div className="pointer-events-none absolute inset-0 grid place-items-center">
                  <div className="rotate-[-30deg] font-display text-5xl font-bold text-rose-600/20 tracking-widest text-center leading-tight">
                    CONFIDENTIAL<br />
                    <span className="text-3xl">{userName.toUpperCase()}</span>
                  </div>
                </div>
                <h1 className="font-display text-3xl mb-2">Legal Brief</h1>
                <p className="text-xs uppercase tracking-widest text-slate-500">{documentName}</p>
                <hr className="my-4 border-slate-300" />
                <p className="text-sm leading-relaxed text-slate-700">
                  This document contains privileged attorney-client communication. Unauthorized
                  disclosure is strictly prohibited under applicable law. All content herein is
                  protected end-to-end and accessible only to the named parties.
                </p>
                <p className="text-sm leading-relaxed text-slate-700 mt-3">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                  incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                  nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <div className="mt-6 grid grid-cols-2 gap-4 text-xs text-slate-600">
                  <div><strong className="block text-slate-800">Client</strong>{userName}</div>
                  <div><strong className="block text-slate-800">Reference</strong>AVL-2026-0428</div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
