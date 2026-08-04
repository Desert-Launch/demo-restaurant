"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useCartActions } from "@/features/cart";
import { resetStore } from "@/lib/store";
import { sleep } from "@/lib/utils";
import { fetchDashboard } from "../api";

export const dashboardKeys = {
  all: ["dashboard"] as const,
  summary: () => [...dashboardKeys.all, "summary"] as const,
};

export function useDashboard() {
  return useQuery({
    queryKey: dashboardKeys.summary(),
    queryFn: fetchDashboard,
  });
}

/**
 * Puts the demo back to the state it was in when the tab was opened: reseed the
 * store, empty the cart, and drop every cached query so nothing stale survives.
 */
export function useResetDemoData() {
  const queryClient = useQueryClient();
  const { clear } = useCartActions();

  return useMutation({
    mutationFn: async () => {
      await sleep(220);
      resetStore();
    },
    onSuccess: () => {
      clear();
      void queryClient.invalidateQueries();
      toast.success("Demo data reset", {
        description: "The book, the board and the menu are back to the seed.",
      });
    },
  });
}
