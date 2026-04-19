import { create } from "zustand";
import { INITIAL_CONSULTATIONS, type Consultation } from "./mock-data";

interface AppState {
  user: { name: string; email: string } | null;
  consultations: Consultation[];
  setUser: (u: { name: string; email: string } | null) => void;
  addConsultation: (c: Omit<Consultation, "id" | "status">) => void;
  advance: (id: string) => void;
}

export const useApp = create<AppState>((set) => ({
  user: { name: "Alex Mercier", email: "alex@avocat-link.io" },
  consultations: INITIAL_CONSULTATIONS,
  setUser: (u) => set({ user: u }),
  addConsultation: (c) =>
    set((s) => ({
      consultations: [
        { ...c, id: crypto.randomUUID(), status: "Pending" },
        ...s.consultations,
      ],
    })),
  advance: (id) =>
    set((s) => ({
      consultations: s.consultations.map((c) => {
        if (c.id !== id) return c;
        const order: Consultation["status"][] = ["Pending", "Analyzing", "Confirmed"];
        const next = order[Math.min(order.length - 1, order.indexOf(c.status) + 1)];
        return { ...c, status: next };
      }),
    })),
}));
