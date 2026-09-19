"use client";

import { create } from "zustand";

import type { StaffMember } from "@/types";

/** The demo's stand-in for an auth session. Nothing is checked or enforced. */
export const STAFF_ROSTER: StaffMember[] = [
  {
    id: "staff_salim",
    name: "Manager 1",
    role: "Restaurant manager",
    initials: "M1",
  },
  { id: "staff_yasmin", name: "Host 1", role: "Host", initials: "H1" },
  { id: "staff_nour", name: "Chef 1", role: "Head chef", initials: "C1" },
  {
    id: "staff_marco",
    name: "Chef 2",
    role: "On the pass",
    initials: "C2",
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
