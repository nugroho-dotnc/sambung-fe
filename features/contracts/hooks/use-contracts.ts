"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ContractService } from "../services/contract.service";
import type {
  CreateOrderInput,
  CounterOfferInput,
  CancelContractInput,
} from "../schemas";

export const CONTRACT_QUERY_KEYS = {
  all: ["contracts"] as const,
  lists: () => [...CONTRACT_QUERY_KEYS.all, "list"] as const,
  list: (status?: string) => [...CONTRACT_QUERY_KEYS.lists(), { status }] as const,
  details: () => [...CONTRACT_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...CONTRACT_QUERY_KEYS.details(), id] as const,
};

export function useContracts(status?: string) {
  return useQuery({
    queryKey: CONTRACT_QUERY_KEYS.list(status),
    queryFn: () => ContractService.getMyContracts(status),
    staleTime: 10_000,
  });
}

export function useContract(id: string) {
  return useQuery({
    queryKey: CONTRACT_QUERY_KEYS.detail(id),
    queryFn: () => ContractService.getContractById(id),
    enabled: Boolean(id),
    staleTime: 10_000,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateOrderInput) => ContractService.createOrder(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: CONTRACT_QUERY_KEYS.all });
      void queryClient.invalidateQueries({ queryKey: ["offers"] });
    },
  });
}

export function useAcceptPrice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ContractService.acceptPrice(id),
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: CONTRACT_QUERY_KEYS.all });
      void queryClient.invalidateQueries({ queryKey: ["offers"] });
    },
  });
}

export function useCounterOffer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: CounterOfferInput }) =>
      ContractService.counterOffer(id, input),
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: CONTRACT_QUERY_KEYS.all });
    },
  });
}

export function useCancelContract() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: CancelContractInput }) =>
      ContractService.cancelContract(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: CONTRACT_QUERY_KEYS.all });
      void queryClient.invalidateQueries({ queryKey: ["offers"] });
    },
  });
}

export function useConfirmCompletion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ContractService.confirmCompletion(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: CONTRACT_QUERY_KEYS.all });
      void queryClient.invalidateQueries({ queryKey: ["offers"] });
    },
  });
}
