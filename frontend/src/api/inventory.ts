import { api } from "./client";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Category {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  item_count: number;
}

export interface Item {
  id: number;
  name: string;
  description: string | null;
  category_id: number;
  category: Omit<Category, "item_count">;
  quantity: number;
  unit: string | null;
  unit_price: string | null;
  sku: string | null;
  location: string | null;
  reorder_level: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface InventorySummary {
  total_items: number;
  total_quantity: number;
  total_categories: number;
  low_stock_count: number;
}

export type CategoryCreate = Pick<Category, "name"> & { description?: string };
export type CategoryUpdate = Partial<CategoryCreate>;

export type ItemCreate = Omit<Item, "id" | "category" | "created_at" | "updated_at">;
export type ItemUpdate = Partial<ItemCreate>;

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

export const loginUser = (email: string, password: string) =>
  api.post<AuthUser>("/api/login", { email, password });

// ── Summary ───────────────────────────────────────────────────────────────────

export const getSummary = () => api.get<InventorySummary>("/api/summary");

// ── Categories ────────────────────────────────────────────────────────────────

export const getCategories = () => api.get<Category[]>("/api/categories");
export const createCategory = (body: CategoryCreate) =>
  api.post<Category>("/api/categories", body);
export const updateCategory = (id: number, body: CategoryUpdate) =>
  api.put<Category>(`/api/categories/${id}`, body);
export const deleteCategory = (id: number) =>
  api.delete(`/api/categories/${id}`);

// ── Items ─────────────────────────────────────────────────────────────────────

export const getItems = (params?: { category_id?: number; search?: string }) => {
  const qs = new URLSearchParams();
  if (params?.category_id) qs.set("category_id", String(params.category_id));
  if (params?.search) qs.set("search", params.search);
  const query = qs.toString();
  return api.get<Item[]>(`/api/items${query ? `?${query}` : ""}`);
};

export const getItem = (id: number) => api.get<Item>(`/api/items/${id}`);
export const createItem = (body: ItemCreate) => api.post<Item>("/api/items", body);
export const updateItem = (id: number, body: ItemUpdate) =>
  api.put<Item>(`/api/items/${id}`, body);
export const deleteItem = (id: number) => api.delete(`/api/items/${id}`);
