import { apiClient } from "@/lib/api/client";
import type {
  Contract,
  CreateOrderInput,
  CounterOfferInput,
  CancelContractInput,
} from "../schemas";

export class ContractService {
  static async getMyContracts(status?: string): Promise<Contract[]> {
    const query = status && status !== "all" ? `?status=${encodeURIComponent(status)}` : "";
    const response = await apiClient.get<{ data: Contract[] }>(`/contracts${query}`);
    return response.data;
  }

  static async getContractById(id: string): Promise<Contract> {
    const response = await apiClient.get<{ data: Contract }>(`/contracts/${encodeURIComponent(id)}`);
    return response.data;
  }

  static async createOrder(input: CreateOrderInput): Promise<Contract> {
    const response = await apiClient.post<{ data: Contract }>("/contracts", input, {
      headers: {
        "Idempotency-Key": crypto.randomUUID(),
      },
    });
    return response.data;
  }

  static async acceptPrice(id: string): Promise<Contract> {
    const response = await apiClient.post<{ data: Contract }>(
      `/contracts/${encodeURIComponent(id)}/accept`,
      {},
      {
        headers: {
          "Idempotency-Key": crypto.randomUUID(),
        },
      }
    );
    return response.data;
  }

  static async counterOffer(id: string, input: CounterOfferInput): Promise<Contract> {
    const response = await apiClient.post<{ data: Contract }>(
      `/contracts/${encodeURIComponent(id)}/counter`,
      input,
      {
        headers: {
          "Idempotency-Key": crypto.randomUUID(),
        },
      }
    );
    return response.data;
  }

  static async cancelContract(id: string, input: CancelContractInput): Promise<Contract> {
    const response = await apiClient.post<{ data: Contract }>(
      `/contracts/${encodeURIComponent(id)}/cancel`,
      input,
      {
        headers: {
          "Idempotency-Key": crypto.randomUUID(),
        },
      }
    );
    return response.data;
  }

  static async confirmCompletion(id: string): Promise<Contract> {
    const response = await apiClient.post<{ data: Contract }>(
      `/contracts/${encodeURIComponent(id)}/confirm`,
      {},
      {
        headers: {
          "Idempotency-Key": crypto.randomUUID(),
        },
      }
    );
    return response.data;
  }
}
