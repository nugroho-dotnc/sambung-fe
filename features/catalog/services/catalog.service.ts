import { apiClient } from "@/lib/api/client";
import type { CatalogItem, CatalogQueryFilter } from "../schemas";

export class CatalogService {
  static async getCatalog(filter?: CatalogQueryFilter): Promise<CatalogItem[]> {
    const params = new URLSearchParams();
    if (filter?.grainType && filter.grainType !== "ALL") {
      params.append("grainType", filter.grainType);
    }
    if (filter?.regency) params.append("regency", filter.regency);
    if (filter?.district) params.append("district", filter.district);
    if (filter?.search) params.append("search", filter.search);

    const query = params.toString() ? `?${params.toString()}` : "";
    const response = await apiClient.get<{ data: CatalogItem[] }>(`/catalog${query}`);
    return response.data;
  }

  static async getCatalogItem(id: string): Promise<CatalogItem> {
    const response = await apiClient.get<{ data: CatalogItem }>(`/catalog/${encodeURIComponent(id)}`);
    return response.data;
  }
}
