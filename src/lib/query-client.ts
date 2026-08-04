import { QueryClient } from "@tanstack/react-query";

/**
 * The demo's data lives in memory, but every read goes through TanStack Query
 * so loading, error and invalidation behave exactly as they would against a
 * real API. Retries are off so the deliberate failure path in
 * `cancelReservation` / `cancelOrder` surfaces immediately instead of being
 * silently retried away.
 */
export function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 15_000,
        refetchOnWindowFocus: false,
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
}
