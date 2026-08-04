"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { Order, OrderLine, OrderStatus } from "@/types";
import {
  cancelOrder,
  fetchOrder,
  fetchOrders,
  placeOrder,
  updateOrderLines,
  updateOrderNote,
  updateOrderStatus,
  type PlaceOrderInput,
} from "../api";

export const orderKeys = {
  all: ["orders"] as const,
  list: () => [...orderKeys.all, "list"] as const,
  detail: (id: string) => [...orderKeys.all, "detail", id] as const,
};

export function useOrders() {
  return useQuery({ queryKey: orderKeys.list(), queryFn: fetchOrders });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => fetchOrder(id),
    enabled: id.length > 0,
  });
}

export function usePlaceOrder() {
  const queryClient = useQueryClient();
  return useMutation<Order, Error, PlaceOrderInput>({
    mutationFn: placeOrder,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
}

/** Advancing a ticket has to feel instant on the pass, so the card moves first. */
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation<
    Order,
    Error,
    { id: string; status: OrderStatus },
    { previous: Order[] | undefined }
  >({
    mutationFn: ({ id, status }) => updateOrderStatus(id, status),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: orderKeys.list() });
      const previous = queryClient.getQueryData<Order[]>(orderKeys.list());

      queryClient.setQueryData<Order[]>(orderKeys.list(), (orders) =>
        orders?.map((order) =>
          order.id === id ? { ...order, status } : order,
        ),
      );

      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(orderKeys.list(), context.previous);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
}

export function useUpdateOrderLines() {
  const queryClient = useQueryClient();
  return useMutation<Order, Error, { id: string; lines: OrderLine[] }>({
    mutationFn: ({ id, lines }) => updateOrderLines(id, lines),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
}

export function useUpdateOrderNote() {
  const queryClient = useQueryClient();
  return useMutation<Order, Error, { id: string; staffNote: string }>({
    mutationFn: ({ id, staffNote }) => updateOrderNote(id, staffNote),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
}

/**
 * The deliberate failure path. The ticket moves to Cancelled straight away,
 * then comes back with an error toast roughly one time in ten.
 */
export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation<
    Order,
    Error,
    { id: string; reason: string },
    { previous: Order[] | undefined }
  >({
    mutationFn: ({ id, reason }) => cancelOrder(id, reason),
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: orderKeys.list() });
      const previous = queryClient.getQueryData<Order[]>(orderKeys.list());

      queryClient.setQueryData<Order[]>(orderKeys.list(), (orders) =>
        orders?.map((order) =>
          order.id === id ? { ...order, status: "cancelled" as const } : order,
        ),
      );

      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(orderKeys.list(), context.previous);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
}
