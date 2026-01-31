import { apiClient } from './client';
import type { ApiResponse } from '../types';

export interface Category {
  _id: string;
  slug: string;
  label: string;
  order: number;
}

export const fetchCategories = async (): Promise<Category[]> => {
  const { data } = await apiClient.get<ApiResponse<Category[]>>('/api/categories');
  return data.data;
};

export const createCategory = async (payload: { slug: string; label: string; order?: number }): Promise<Category> => {
  const { data } = await apiClient.post<ApiResponse<Category>>('/api/categories', payload);
  return data.data;
};

export const updateCategory = async (slug: string, payload: { label?: string; order?: number; newSlug?: string }): Promise<Category> => {
  const { data } = await apiClient.patch<ApiResponse<Category>>(`/api/categories/${slug}`, payload);
  return data.data;
};

export const deleteCategory = async (slug: string): Promise<void> => {
  await apiClient.delete(`/api/categories/${slug}`);
};
