"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { Reservation, ReservationStatus } from "@/types";
import {
  bookReservation,
  cancelReservation,
  deleteReservation,
  fetchDayOccupancy,
  fetchReservation,
  fetchReservations,
  updateReservation,
  updateReservationStatus,
  type BookReservationInput,
  type UpdateReservationInput,
} from "../api";
import type { SlotOccupancy } from "../availability";

export const reservationKeys = {
  all: ["reservations"] as const,
  list: () => [...reservationKeys.all, "list"] as const,
  detail: (id: string) => [...reservationKeys.all, "detail", id] as const,
  occupancy: (dayIso: string) =>
    [...reservationKeys.all, "occupancy", dayIso] as const,
};

export function useReservations() {
  return useQuery({
    queryKey: reservationKeys.list(),
    queryFn: fetchReservations,
  });
}

export function useReservation(id: string) {
  return useQuery({
    queryKey: reservationKeys.detail(id),
    queryFn: () => fetchReservation(id),
    enabled: id.length > 0,
  });
}

/** Occupancy for one day. Party size is applied client-side, so changing it
 *  re-reads the same cached day rather than hitting the store again. */
export function useDayOccupancy(dayIso: string) {
  return useQuery({
    queryKey: reservationKeys.occupancy(dayIso),
    queryFn: () => fetchDayOccupancy(dayIso),
    enabled: dayIso.length > 0,
  });
}

export function useBookReservation() {
  const queryClient = useQueryClient();
  return useMutation<Reservation, Error, BookReservationInput>({
    mutationFn: bookReservation,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: reservationKeys.all });
    },
  });
}

export function useUpdateReservation() {
  const queryClient = useQueryClient();
  return useMutation<
    Reservation,
    Error,
    { id: string; input: UpdateReservationInput }
  >({
    mutationFn: ({ id, input }) => updateReservation(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: reservationKeys.all });
    },
  });
}

export function useDeleteReservation() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteReservation,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: reservationKeys.all });
    },
  });
}

/**
 * Seating and closing a table happen while the host is standing at the door,
 * so the row moves first and rolls back if the write throws.
 */
export function useUpdateReservationStatus() {
  const queryClient = useQueryClient();

  return useMutation<
    Reservation,
    Error,
    { id: string; status: ReservationStatus },
    { previous: Reservation[] | undefined }
  >({
    mutationFn: ({ id, status }) => updateReservationStatus(id, status),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: reservationKeys.list() });
      const previous = queryClient.getQueryData<Reservation[]>(
        reservationKeys.list(),
      );

      queryClient.setQueryData<Reservation[]>(reservationKeys.list(), (rows) =>
        rows?.map((row) => (row.id === id ? { ...row, status } : row)),
      );

      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(reservationKeys.list(), context.previous);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: reservationKeys.all });
    },
  });
}

/**
 * The deliberate failure path. The row goes to Cancelled straight away, then
 * comes back with an error toast roughly one time in ten.
 */
export function useCancelReservation() {
  const queryClient = useQueryClient();

  return useMutation<
    Reservation,
    Error,
    { id: string; reason: string },
    { previous: Reservation[] | undefined }
  >({
    mutationFn: ({ id, reason }) => cancelReservation(id, reason),
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: reservationKeys.list() });
      const previous = queryClient.getQueryData<Reservation[]>(
        reservationKeys.list(),
      );

      queryClient.setQueryData<Reservation[]>(reservationKeys.list(), (rows) =>
        rows?.map((row) =>
          row.id === id ? { ...row, status: "cancelled" as const } : row,
        ),
      );

      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(reservationKeys.list(), context.previous);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: reservationKeys.all });
    },
  });
}

export type { SlotOccupancy };
