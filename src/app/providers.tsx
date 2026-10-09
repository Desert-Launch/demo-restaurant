"use client";

import { useEffect, useState, type ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useCartStore } from "@/features/cart";
import { makeQueryClient } from "@/lib/query-client";
import { onStoreChange } from "@/lib/store/persist";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(makeQueryClient);

  // A reservation or an order made in another tab lands in this one's store;
  // refetch so an open dashboard shows it without a refresh.
  useEffect(
    () => onStoreChange(() => void queryClient.invalidateQueries()),
    [queryClient],
  );

  // The cart skips hydration at creation so the server render and the first
  // client render match; restore it from sessionStorage once mounted.
  useEffect(() => {
    void useCartStore.persist.rehydrate();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
      <Toaster theme="dark" position="bottom-right" closeButton />
    </QueryClientProvider>
  );
}
