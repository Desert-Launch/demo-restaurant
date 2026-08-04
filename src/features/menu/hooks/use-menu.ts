"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { MenuItem } from "@/types";
import {
  createMenuItem,
  deleteMenuItem,
  fetchMenu,
  fetchMenuItem,
  setMenuItemAvailability,
  updateMenuItem,
  type MenuItemInput,
} from "../api";

export const menuKeys = {
  all: ["menu"] as const,
  list: () => [...menuKeys.all, "list"] as const,
  detail: (id: string) => [...menuKeys.all, "detail", id] as const,
};

export function useMenu() {
  return useQuery({ queryKey: menuKeys.list(), queryFn: fetchMenu });
}

export function useMenuItem(id: string) {
  return useQuery({
    queryKey: menuKeys.detail(id),
    queryFn: () => fetchMenuItem(id),
    enabled: id.length > 0,
  });
}

export function useCreateMenuItem() {
  const queryClient = useQueryClient();
  return useMutation<MenuItem, Error, MenuItemInput>({
    mutationFn: createMenuItem,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: menuKeys.all });
    },
  });
}

export function useUpdateMenuItem() {
  const queryClient = useQueryClient();
  return useMutation<MenuItem, Error, { id: string; input: MenuItemInput }>({
    mutationFn: ({ id, input }) => updateMenuItem(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: menuKeys.all });
    },
  });
}

export function useDeleteMenuItem() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteMenuItem,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: menuKeys.all });
    },
  });
}

/**
 * 86'ing flips optimistically — it has to feel instant when the kitchen calls
 * it across the pass — and rolls the cached list back if the write throws.
 */
export function useSetMenuItemAvailability() {
  const queryClient = useQueryClient();

  return useMutation<
    MenuItem,
    Error,
    { id: string; available: boolean },
    { previous: MenuItem[] | undefined }
  >({
    mutationFn: ({ id, available }) => setMenuItemAvailability(id, available),
    onMutate: async ({ id, available }) => {
      await queryClient.cancelQueries({ queryKey: menuKeys.list() });
      const previous = queryClient.getQueryData<MenuItem[]>(menuKeys.list());

      queryClient.setQueryData<MenuItem[]>(menuKeys.list(), (items) =>
        items?.map((item) => (item.id === id ? { ...item, available } : item)),
      );

      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(menuKeys.list(), context.previous);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: menuKeys.all });
    },
  });
}
