"use client";

import { create } from "zustand";

import type { StaffMember } from "@/types";

/** The demo's stand-in for an auth session. Nothing is checked or enforced. */
export const STAFF_ROSTER: StaffMember[] = [
  {
    id: "staff_salim",
    name: "Salim Al Marri",
    role: "Restaurant manager",
    initials: "SM",
  },
  { id: "staff_yasmin", name: "Yasmin Farah", role: "Host", initials: "YF" },
  { id: "staff_nour", name: "Nour Haddad", role: "Head chef", initials: "NH" },
  {
    id: "staff_marco",
    name: "Marco Ferreira",
    role: "On the pass",
    initials: "MF",
  },
];

interface StaffState {
  current: StaffMember;
  setCurrent: (id: string) => void;
}

export const useStaffStore = create<StaffState>()((set) => ({
  current: STAFF_ROSTER[0],
  setCurrent: (id) =>
    set((state) => ({
      current: STAFF_ROSTER.find((member) => member.id === id) ?? state.current,
    })),
}));
