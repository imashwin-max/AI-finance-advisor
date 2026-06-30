import api from "./api";
import type { Transaction, TransactionFilters } from "@/types/transaction";

export const transactionService = {
  async list(filters: TransactionFilters = {}): Promise<Transaction[]> {
    const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== undefined && v !== ""));
    const { data } = await api.get<Transaction[]>("/transactions", { params });
    return data;
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/transactions/${id}`);
  },

  async uploadCsv(file: File, onProgress?: (pct: number) => void): Promise<{ message: string; transactions_imported: number }> {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await api.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (evt) => {
        if (onProgress && evt.total) onProgress(Math.round((evt.loaded / evt.total) * 100));
      },
    });
    return data;
  },

  sampleCsvUrl(): string {
    return `${api.defaults.baseURL}/upload/sample-csv`;
  },
};
