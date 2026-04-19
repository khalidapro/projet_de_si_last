export type Specialty = "Business" | "Penal" | "Family";

export interface Lawyer {
  id: string;
  name: string;
  specialty: Specialty;
  rate: number;
  rating: number;
  cases: number;
  city: string;
  initials: string;
  bio: string;
}

export const LAWYERS: Lawyer[] = [
  { id: "1", name: "Amelia Laurent", specialty: "Business", rate: 280, rating: 4.9, cases: 142, city: "Paris", initials: "AL", bio: "M&A and corporate restructuring specialist." },
  { id: "2", name: "Julien Moreau", specialty: "Penal", rate: 320, rating: 4.8, cases: 98, city: "Lyon", initials: "JM", bio: "Criminal defense — 15 years at the bar." },
  { id: "3", name: "Sofia Renard", specialty: "Family", rate: 190, rating: 4.95, cases: 211, city: "Bordeaux", initials: "SR", bio: "Mediation, divorce, custody arrangements." },
  { id: "4", name: "Marc Delacroix", specialty: "Business", rate: 410, rating: 4.7, cases: 76, city: "Paris", initials: "MD", bio: "International contracts & arbitration." },
  { id: "5", name: "Inès Vautrin", specialty: "Penal", rate: 250, rating: 4.85, cases: 134, city: "Marseille", initials: "IV", bio: "White-collar crime defense." },
  { id: "6", name: "Théo Bonnet", specialty: "Family", rate: 175, rating: 4.75, cases: 188, city: "Nantes", initials: "TB", bio: "Estate planning and family disputes." },
  { id: "7", name: "Clara Aubert", specialty: "Business", rate: 360, rating: 4.92, cases: 105, city: "Paris", initials: "CA", bio: "Startup law — fundraising & IP." },
  { id: "8", name: "Hugo Lefèvre", specialty: "Penal", rate: 290, rating: 4.6, cases: 87, city: "Toulouse", initials: "HL", bio: "Appeals and constitutional litigation." },
];

export interface Consultation {
  id: string;
  lawyer: Lawyer;
  date: string;
  status: "Pending" | "Analyzing" | "Confirmed";
  documentName: string;
}

export const INITIAL_CONSULTATIONS: Consultation[] = [
  { id: "c1", lawyer: LAWYERS[0], date: "2026-04-28T10:00:00", status: "Confirmed", documentName: "NDA_Acquisition_v3.pdf" },
  { id: "c2", lawyer: LAWYERS[2], date: "2026-04-30T14:30:00", status: "Analyzing", documentName: "Custody_Brief.pdf" },
  { id: "c3", lawyer: LAWYERS[4], date: "2026-05-02T09:00:00", status: "Pending", documentName: "Case_File_2026.pdf" },
];
