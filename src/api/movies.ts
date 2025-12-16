import { apiClient } from './client';
import type { ApiResponse, Movie, MovieCategory } from '../types';

export interface PublicPreview {
  id: string;
  title: string;
  thumbnailUrl: string;
  previewUrl: string;
  embedUrl: string;
  duration?: number;
}

export const fetchMovies = async (): Promise<Movie[]> => {
  const { data } = await apiClient.get<ApiResponse<Movie[]>>('/api/movies');
  return data.data;
};

export const fetchFreePreviews = async (): Promise<Movie[]> => {
  const { data } = await apiClient.get<ApiResponse<Movie[]>>('/api/movies/free-previews');
  return data.data;
};

export const updateMovie = async (id: string, updates: { category?: MovieCategory; title?: string; isFreePreview?: boolean; tags?: string[] }): Promise<Movie> => {
  const { data } = await apiClient.patch<ApiResponse<Movie>>(`/api/movies/${id}`, updates);
  return data.data;
};

/**
 * Fetch previews from the PUBLIC Bunny library
 * These are directly from Bunny.net, no MongoDB
 */
export const fetchPublicPreviews = async (): Promise<PublicPreview[]> => {
  const { data } = await apiClient.get<ApiResponse<PublicPreview[]>>('/api/public/previews');
  return data.data;
};
